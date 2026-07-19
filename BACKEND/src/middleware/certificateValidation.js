import { z } from "zod";

// Schema for searching certificate records
export const searchCertificateSchema = z.object({
  body: z.object({
    year: z.union([z.string(), z.number()], { required_error: "Year is required" }),
    standard: z.string({ required_error: "Standard is required" }),
    district: z.string({ required_error: "District is required" }),
    searchBy: z.enum(["Rgn", "RollNo"], { 
      required_error: "searchBy is required and must be either 'Rgn' or 'RollNo'" 
    }),
    searchValue: z.string({ required_error: "searchValue is required" }),
  }),
});

// Schema for updating certificate records (enforcing at least 1, at most 2 fields to update)
export const updateCertificateSchema = z.object({
  body: z.object({
    year: z.union([z.string(), z.number()], { required_error: "Year is required" }),
    standard: z.string({ required_error: "Standard is required" }),
    district: z.string({ required_error: "District is required" }),
    searchBy: z.enum(["Rgn", "RollNo"], { 
      required_error: "searchBy is required and must be either 'Rgn' or 'RollNo'" 
    }),
    searchValue: z.string({ required_error: "searchValue is required" }),
    Name: z.string().optional(),
    Father: z.string().optional(),
    Mother: z.string().optional(),
    Madrasa: z.string().optional(),
    DOB: z.string().optional(),
  }).refine(
    (data) => {
      const updateFields = ["Name", "Father", "Mother", "Madrasa", "DOB"];
      // Count fields that are defined (not undefined)
      const count = updateFields.filter((field) => data[field] !== undefined).length;
      return count >= 1 && count <= 2;
    },
    {
      message: "You must update at least 1 and a maximum of 2 fields at a time (Name, Father, Mother, Madrasa, DOB)",
      path: ["Name"],
    }
  ),
});
