import { request } from "http";
import { test, expect } from "../../fixtures/test-data-fixtures";
import compareResponseWithRequest from "../../utils/compareResponseWithRequest";
import { executeQuery } from "../../utils/dbUtils";

test.describe.configure({ mode: "serial" });

test.describe("API e2e test to perform CRUD operations on student data", () => {
  let studentID;

  test("Retrieve all students and validate the response", async ({ request}) => {
   const response = await request.get(`${process.env.API_ENDPOINT}`)
   
   const responseBody = await response.json();
    console.log(responseBody);

    expect(response.ok()).toBeTruthy();

    expect(responseBody.length).toBeGreaterThanOrEqual(2)

     for (const student of responseBody) {
          expect(student).toHaveProperty('STUDENT_ID');
    }
    

    studentID = responseBody[0].STUDENT_ID
  })


   test("Create a new student and validate the response", async ({ request, newStudent}) => {
    const response = await request.post(process.env.API_ENDPOINT!, {
      data: newStudent,
    })

    const responseBody = await response.json();
    console.log(responseBody);

    expect(response.status()).toBe(201);
     expect(Number(responseBody.STUDENT_ID)).toBeGreaterThanOrEqual(2)
   

    const name = responseBody.FIRST_NAME;
    studentID = responseBody.STUDENT_ID;
    
  console.log("Student created:", responseBody);

    // for (const key in newStudent) {
    //   expect(responseBody[key]).toBe(newStudent[key]);
    // }
     compareResponseWithRequest(responseBody, newStudent);

   })

   test("Get the student we created using GET", async ({  request, newStudent, }) => {

    const response = await request.get(`${process.env.API_ENDPOINT}/${studentID}`)
     
  
    expect(response.status()).toBe(200);

  const responseBody = await response.json();
   
  console.log(responseBody);
    compareResponseWithRequest(responseBody, newStudent);

   })


   test("Update Newly Created Student with a Different Instructor", async ({  request, updatedStudent, }) => {

    const response = await request.put(
      `${process.env.API_ENDPOINT}/${studentID}`,
      {
        data: updatedStudent,
      }
    );

    const responseBody = await response.json();
    const newInstructor = responseBody.INSTRUCTOR_ID

     const newMessage = `Successfully updated the student with the STUDENT_ID: ${ studentID }`

     expect(responseBody.message).toBe(newMessage)
     expect(response.status()).toBe(200);

  })

  test("Delete the student  using DELETE", async ({ request, updatedStudent }) => {

    const response = await request.delete(
      `${process.env.API_ENDPOINT}/${studentID}`,
      {
        data: updatedStudent,
      }
    );
     expect(response.status()).toBe(204);

});
    
  }) 


