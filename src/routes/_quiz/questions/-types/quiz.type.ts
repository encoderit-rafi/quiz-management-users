import { z } from 'zod'

// Answer category score schema
export const AnswerCategoryScoreSchema = z.object({
  quiz_category_id: z.number(),
  points: z.number(),
})

// Answer Schema
export const AnswerSchema = z.object({
  id: z.number(),
  question_id: z.number(),
  answer_text: z.string(),
  points: z.number(),
  order: z.number(),
  category_scores: z.array(AnswerCategoryScoreSchema).optional(),
})

// Question Schema
export const QuestionSchema = z.object({
  id: z.number(),
  quiz_id: z.number(),
  question_text: z.string(),
  image: z.string().url().nullable(),
  order: z.number(),
  multiselect: z.boolean(),
  answers: z.array(AnswerSchema),
})

// Quiz category schema
export const QuizCategorySchema = z.object({
  id: z.number(),
  quiz_id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  order: z.number(),
})

// Result Page Schema
export const ResultPageSchema = z.object({
  id: z.number(),
  quiz_id: z.number(),
  title: z.string(),
  content: z.string(), // HTML string
  image: z.string().url().nullable(),
  min_score: z.number().nullable(),
  max_score: z.number().nullable(),
  order: z.number(),
})

// Lead Form Field Schema
export const LeadFormFieldSchema = z.object({
  type: z.string(),
  label: z.string(),
  required: z.boolean(),
  enabled: z.boolean(),
  field_name: z.string().optional(),
  name: z.string().optional(),
  // options: z.array(z.string()).optional(),
})

// Lead Form Setting Schema
export const LeadFormSettingSchema = z.object({
  id: z.number(),
  quiz_id: z.number(),
  fields: z.array(LeadFormFieldSchema),
})

// Result Delivery Setting Schema
export const ResultDeliverySettingSchema = z.object({
  id: z.number(),
  quiz_id: z.number(),
  enable_email_result: z.boolean(),
  enable_pdf_download: z.boolean(),
  enable_link_share: z.boolean(),
  email_subject: z.string().nullable(),
  email_body: z.string().nullable(),
  result_page_position: z.string(),
})

// Quiz Schema
export const QuizSchema = z.object({
  id: z.number(),
  uuid: z.uuid(),

  name: z.string(),
  title: z.string(),
  heading: z.string(),
  description: z.string(),
  submit_button_text: z.string(),
  result_button_text: z.string(),
  landing_page_text: z.string(), // HTML string
  cta_text: z.string(),

  background_image: z.string().url().nullable(),
  logo: z.string().url().nullable(),

  primary_color: z.string(), // hex color
  secondary_color: z.string(), // hex color

  is_active: z.boolean(),

  views: z.union([z.number(), z.string()]), // API might send either

  scoring_mode: z.enum(['total', 'category']).default('total'),

  client_id: z.number().nullable().optional(),
  embed_code: z.string().nullable(),

  categories: z.array(QuizCategorySchema).optional(),
  questions: z.array(QuestionSchema).optional(),
  resultPages: z.array(ResultPageSchema).optional(),
  leadFormSetting: LeadFormSettingSchema.nullable().optional(),
  resultDeliverySetting: ResultDeliverySettingSchema.nullable().optional(),
})

// Type inference
export type TQuizSchema = z.infer<typeof QuizSchema>
export type TQuestionSchema = z.infer<typeof QuestionSchema>
export type TAnswerSchema = z.infer<typeof AnswerSchema>
export type TAnswerCategoryScore = z.infer<typeof AnswerCategoryScoreSchema>
export type TQuizCategory = z.infer<typeof QuizCategorySchema>
export type TResultPageSchema = z.infer<typeof ResultPageSchema>
export type TLeadFormField = z.infer<typeof LeadFormFieldSchema>
export type TLeadFormSetting = z.infer<typeof LeadFormSettingSchema>
export type TResultDeliverySetting = z.infer<typeof ResultDeliverySettingSchema>
