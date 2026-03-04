import { pgTable, serial, text, varchar, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const sectors = pgTable('sectors', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
});

export const options = pgTable('options', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  sectorId: integer('sector_id').references(() => sectors.id, { onDelete: 'cascade' }),
});

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  optionId: integer('option_id').references(() => options.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const chapters = pgTable('chapters', {
    id: serial('id').primaryKey(),
    title: varchar('title').notNull(),
    content: text('content').notNull(), // Le JSON de l'IA
    description: text('description'),   // <--- AJOUTE CETTE LIGNE
    order: integer('order').default(0),
    courseId: integer('course_id').references(() => courses.id),
    createdAt: varchar('createdAt'),
});;

export const exercises = pgTable('exercises', {
  id: serial('id').primaryKey(),
  chapterId: integer('chapter_id').references(() => chapters.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  options: text('options').array().notNull(),
  answer: text('answer').notNull(),
  explanation: text('explanation'),
});


export const sectorsRelations = relations(sectors, ({ many }) => ({
  options: many(options),
}));

export const optionsRelations = relations(options, ({ one, many }) => ({
  sector: one(sectors, { fields: [options.sectorId], references: [sectors.id] }),
  courses: many(courses),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  option: one(options, { fields: [courses.optionId], references: [options.id] }),
  chapters: many(chapters),
}));

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  course: one(courses, { fields: [chapters.courseId], references: [courses.id] }),
  exercises: many(exercises),
}));

export const exercisesRelations = relations(exercises, ({ one }) => ({
  chapter: one(chapters, {
    fields: [exercises.chapterId],
    references: [chapters.id],
  }),
}));