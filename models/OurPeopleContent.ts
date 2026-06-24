import { Schema, model, models } from "mongoose";

const PersonSchema = new Schema(
  {
    id:          { type: String, required: true },
    name:        { type: String, default: "" },
    title:       { type: String, default: "" },
    description: { type: String, default: "" },
    image:       { type: String, default: "" },
  },
  { _id: false }
);

const OurPeopleContentSchema = new Schema(
  {
    // Hero
    heroHeadingMain:   { type: String, default: "" },
    heroHeadingAccent: { type: String, default: "" },
    heroSubtext:       { type: String, default: "" },

    // People (dynamic array)
    people: { type: [PersonSchema], default: [] },

    // Legacy flat fields kept so old data is not lost on read
    person1Name: String, person1Title: String, person1Bio1: String, person1Bio2: String,
    person2Name: String, person2Title: String, person2Bio1: String, person2Bio2: String, person2Bio3: String,
    person3Name: String, person3Title: String, person3Bio1: String, person3Bio2: String,
    person4Name: String, person4Title: String, person4Bio1: String, person4Bio2: String,
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development") {
  delete (models as Record<string, unknown>).OurPeopleContent;
}

export default models.OurPeopleContent || model("OurPeopleContent", OurPeopleContentSchema);
