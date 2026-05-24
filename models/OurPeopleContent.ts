import { Schema, model, models } from "mongoose";

const OurPeopleContentSchema = new Schema(
  {
    // Hero
    heroHeadingMain:  { type: String, default: "" },
    heroHeadingAccent: { type: String, default: "" },
    heroSubtext:       { type: String, default: "" },

    // Person 1
    person1Name:  { type: String, default: "" },
    person1Title: { type: String, default: "" },
    person1Bio1:  { type: String, default: "" },
    person1Bio2:  { type: String, default: "" },

    // Person 2
    person2Name:  { type: String, default: "" },
    person2Title: { type: String, default: "" },
    person2Bio1:  { type: String, default: "" },
    person2Bio2:  { type: String, default: "" },
    person2Bio3:  { type: String, default: "" },

    // Person 3
    person3Name:  { type: String, default: "" },
    person3Title: { type: String, default: "" },
    person3Bio1:  { type: String, default: "" },
    person3Bio2:  { type: String, default: "" },

    // Person 4
    person4Name:  { type: String, default: "" },
    person4Title: { type: String, default: "" },
    person4Bio1:  { type: String, default: "" },
    person4Bio2:  { type: String, default: "" },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development") {
  delete (models as Record<string, unknown>).OurPeopleContent;
}

export default models.OurPeopleContent || model("OurPeopleContent", OurPeopleContentSchema);
