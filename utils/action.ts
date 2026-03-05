'use server'

import { eq } from "drizzle-orm";
import { db } from "./db";
import { courses, options, sectors, chapters, exercises } from "./schema";
import { revalidatePath } from "next/cache";


// Utilitaire interne pour le slug (simple et efficace)
const generateSlug = (name: string) => 
  name.toLowerCase()
    .trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Enlève les accents
    .replace(/[^a-z0-9 -]/g, "") // Enlève le spécial
    .replace(/\s+/g, "-"); // Espaces -> tirets

// --- CRÉER UNE FILIÈRE (SECTOR) ---
export async function createSector(name: string) {
  try {
    const [data] = await db.insert(sectors).values({
      name,
      slug: generateSlug(name),
    }).returning();
    
    revalidatePath("/"); // Update le cache
    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Cette filière existe déjà ou une erreur est survenue." };
  }
}

// --- CRÉER UNE OPTION ---
export async function createOption(name: string, sectorId: number) {
  try {
    const [data] = await db.insert(options).values({
      name,
      sectorId,
      slug: generateSlug(name),
    }).returning();
    
    revalidatePath("/");
    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Impossible de créer cette option." };
  }
}

// --- CRÉER UN COURS ---
export async function createCourse(title: string, optionId: number) {
  try {
    const [data] = await db.insert(courses).values({
      title,
      optionId,
    }).returning();
    
    revalidatePath("/");
    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Erreur lors de la création du cours." };
  }
}
// utils/action.ts

export async function getSectorsWithCounts() {
  try {
    const data = await db.query.sectors.findMany({
      with: {
        options: {
          with: {
            courses: true,
          },
        },
      },
    });

    // On formate les données pour inclure les comptes facilement
    return data.map((sector) => ({
      ...sector,
      optionsCount: sector.options.length,
      coursesCount: sector.options.reduce((acc, opt) => acc + opt.courses.length, 0),
    }));
  } catch (error) {
    console.error("Erreur récupération secteurs:", error);
    return [];
  }
}

// --- METTRE À JOUR UNE FILIÈRE ---
export async function updateSector(id: number, name: string) {
  try {
    const [data] = await db.update(sectors)
      .set({ name, slug: generateSlug(name) })
      .where(eq(sectors.id, id))
      .returning();
    revalidatePath("/admin");
    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Erreur lors de la mise à jour." };
  }
}

// --- SUPPRIMER UNE OPTION ---
export async function deleteOption(id: number) {
  try {
    await db.delete(options).where(eq(options.id, id));
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Erreur lors de la suppression." };
  }
}

export async function deleteSector(id: number) {
  try {
    await db.delete(sectors).where(eq(sectors.id, id));
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Erreur lors de la suppression de la filière." };
  }
}

export async function updateOption(id: number, name: string) {
  try {
    // On met à jour l'option qui correspond à l'ID
    await db.update(options)
      .set({ name })
      .where(eq(options.id, id));

    // On demande à Next.js de rafraîchir le cache de la page admin
    revalidatePath("/admin");
    
    return { success: true };
  } catch (error) {
    console.error("Erreur Update Option:", error);
    return { success: false, error: "Impossible de renommer l'option." };
  }
}

// --- RÉCUPÉRER TOUS LES COURS AVEC LEURS RELATIONS ---
export async function getCoursesWithDetails() {
  try {
    const data = await db.query.courses.findMany({
      with: {
        option: {
          with: {
            sector: true, 
          },
        },
        chapters: true, // Pour compter les chapitres
      },
      orderBy: (courses, { desc }) => [desc(courses.id)],
    });
    return data;
  } catch (error) {
    console.error("Erreur récupération cours:", error);
    return [];
  }
}

// --- RÉCUPÉRER LES SECTEURS ET LEURS OPTIONS (POUR LES SELECTS DE LA MODALE) ---
export async function getSectorsData() {
  try {
    const data = await db.query.sectors.findMany({
      with: {
        options: true,
      },
    });
    return data;
  } catch (error) {
    console.error("Erreur récupération secteurs data:", error);
    return [];
  }
}


// utils/action.ts

export async function deleteCourse(id: number) {
  try {
    // 1. On supprime d'abord tous les chapitres liés à ce cours
    await db.delete(chapters).where(eq(chapters.courseId, id));

    // 2. Maintenant on peut supprimer le cours sans erreur
    await db.delete(courses).where(eq(courses.id, id));

    revalidatePath("/admin/cours");
    return { success: true };
  } catch (error) {
    console.error("Erreur suppression:", error);
    return { success: false, error: "Impossible de supprimer le cours" };
  }
}

export async function getCourseWithChapters(courseId: number) {
  try {
    const data = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
      with: {
        option: { with: { sector: true } },
        chapters: true, 
      },
    });
     return data;
     } catch (error) {
    console.error(error);
    return null;
  }
}

// Sauvegarder le chapitre généré par l'IA
export async function saveChapterAI(data: {
  courseId: number,
  title: string,
  content: string, // Le JSON stringifié de l'IA
}) {
  try {
    // NETTOYAGE ET RÉPARATION DU JSON TRONQUÉ
    let jsonString = data.content.trim();
    
    // Si l'IA a coupé la réponse (Unterminated string), on ferme les accolades manuellement
    if (!jsonString.endsWith("}")) {
      console.error("Format JSON incomplet détecté. Tentative de réparation...");
      jsonString += '}}}'; 
    }

    const fullData = JSON.parse(jsonString);

    // 1. Insertion dans la table 'chapters'
    const [newChapter] = await db.insert(chapters).values({
      courseId: data.courseId,
      title: data.title,
      content: jsonString, // On stocke la version nettoyée
      createdAt: new Date().toISOString(),
    }).returning({ id: chapters.id });

    // 2. Insertion des QCM dans la table 'exercises'
    if (newChapter && fullData.exercices?.qcm?.length > 0) {
      const qcmToInsert = fullData.exercices.qcm.map((q: any) => ({
        chapterId: newChapter.id,
        question: q.question,
        options: q.options, 
        answer: q.reponse,
        explanation: q.explication,
      }));

      await db.insert(exercises).values(qcmToInsert);
    }

    // IMPORTANT : Revalidation pour que les cartes apparaissent
    revalidatePath(`/admin/cours/${data.courseId}`);
    
    return { success: true, data: newChapter };
  } catch (error) {
    console.error("Erreur saveChapterAI détaillée:", error);
    // On retourne l'erreur pour que le client sache que ça a échoué
    return { success: false, error: "Erreur de parsing ou base de données." };
  }
}
// Version mise à jour pour récupérer les chapitres ET les exercices


export async function getGlobalStats() {
  try {
    const allSectors = await db.query.sectors.findMany({
      with: {
        options: {
          with: {
            courses: {
              with: {
                chapters: {
                  with: {
                    exercises: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // Calculs agrégés
    let totalOptions = 0;
    let totalCourses = 0;
    let totalChapters = 0;
    let totalExercises = 0;

    const sectorStats = allSectors.map(sector => {
      let sectorCourses = 0;
      sector.options.forEach(opt => {
        totalOptions++;
        sectorCourses += opt.courses.length;
        opt.courses.forEach(course => {
          totalCourses++;
          totalChapters += course.chapters.length;
          course.chapters.forEach(chap => {
            totalExercises += chap.exercises.length;
          });
        });
      });

      return {
        name: sector.name,
        coursesCount: sectorCourses,
        color: sector.name.length % 2 === 0 ? "hsl(var(--p))" : "hsl(var(--s))"
      };
    });

    return {
      overview: [
        { label: "Filières", value: allSectors.length, icon: "Layers" },
        { label: "Options", value: totalOptions, icon: "GitBranch" },
        { label: "Cours", value: totalCourses, icon: "Book" },
        { label: "Exercices IA", value: totalExercises, icon: "BrainCircuit" },
      ],
      sectorStats, // Pour le graphique
      totalChapters
    };
  } catch (error) {
    console.error("Erreur stats:", error);
    return null;
  }
}


export async function getFullSystemStats() {
  try {
    const allData = await db.query.sectors.findMany({
      with: {
        options: {
          with: {
            courses: {
              with: {
                chapters: {
                  with: { exercises: true }
                }
              }
            }
          }
        }
      }
    });

    let totalOptions = 0;
    let totalCourses = 0;
    let totalExercises = 0;
    
    const sectorDistribution = allData.map(s => {
      let count = 0;
      s.options.forEach(o => {
        totalOptions++;
        count += o.courses.length;
        o.courses.forEach(c => {
          totalCourses++;
          c.chapters.forEach(ch => {
            totalExercises += ch.exercises.length;
          });
        });
      });
      return { name: s.name, value: count };
    });

    return {
      totals: {
        sectors: allData.length,
        options: totalOptions,
        courses: totalCourses,
        exercises: totalExercises
      },
      distribution: sectorDistribution
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}


export const deleteChapter = async (chapterId: number) => {
  try {
    await db.delete(chapters).where(eq(chapters.id, chapterId));
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du chapitre:", error);
    return { success: false, error: "Impossible de supprimer le chapitre" };
  }
};