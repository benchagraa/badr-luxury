![logo-light](https://github.com/user-attachments/assets/086e392d-2176-4981-81d1-629a4c4958e9)

A personal hotel/resort react project to manage bookings, unit tested with Jest. 
Used React Query and applied well-off design patterns. 
For the database I used Supabase (greatest Firebase alternative). 
Canva for logo.

Before anything, the project doesn't have a commit history as I've been working on it locally, but it's pretty straightforward to understand, below is an overview of the project architecture/structure :smiley:
## Project Structure

#### `Project Structure`
- **`/context`**: Contains React context providers for global state management
- **`data`**: Mock data (cabins, bookings..)
  - **`cabins`**
- **`/src/features`**:
  - **`/src/features/authentication`**: Handles user authentication (login, signup, etc.)
  - **`/src/features/bookings`**: Manages booking-related functionality (reservations, detail, etc.)
  - **`/src/features/cabins`**: Handles cabin-related functionality (listing, details, etc.)
  - **`/src/features/check-in-out`**: Manages check-in and check-out processes
  - **`/src/features/dashboard`**: Contains the main dashboard UI and logic
  - **`/src/features/settings`**: Handles user settings and preferences
- **`/hooks`**: Custom React hooks for reusable logic
- **`/pages`**: All application pages
- **`/services`**: Supabase API services (backend)
- **`/styles`**: Global styles
- **`/ui`**: Mini library of re-usable UI components (buttons, modals, etc.)
- **`/utils`**: Helper functions

What's been used in this project:

- Smooth UX design (with Dark mode).
- Design patterns like Render Props, Higher Order Components and Error Boundary and more.
- React Query.
- Jest to test components and custom hooks (where most of the logic is).
- Clean code.
- Separate the presentation logic from the business logic.
- Recharts for charts.
- Styled components library.

For CI:
  - Used Azure DevOps CI to create a build/test pipeline (see .yaml file).
    ![image](https://github.com/user-attachments/assets/99b4bacb-8539-4ed6-99cb-84976aee73d2)



Screenshots of the application ( self-explanatory :smiley: ):
  - Dashboard that shows bookings, sales, etc.. with date filters and charts that track sales and duration summary. ![image](https://github.com/user-attachments/assets/4399c3a4-228e-4f3e-9106-3392db78b9ff) ![image](https://github.com/user-attachments/assets/51a12a9a-84b2-4c96-88dd-1e7d1e2139f0)
  - ![image](https://github.com/user-attachments/assets/04e3a970-32fa-4de9-b2b8-c0788ad4996c)
  - ![image](https://github.com/user-attachments/assets/707029a4-af31-4c03-b612-c014a590765c)
  - ![image](https://github.com/user-attachments/assets/0e041b90-ebe6-4efe-b19b-5a2d2906b497)
  - ![image](https://github.com/user-attachments/assets/ad6436f2-34ce-4713-8daf-40278f7cb2a9)
  - ![image](https://github.com/user-attachments/assets/ab0701ac-47ed-4352-a7d7-c908b8277821)
  - ![image](https://github.com/user-attachments/assets/0a786df8-ce3b-4b0f-8210-4b616df72675)
  - ![image](https://github.com/user-attachments/assets/e0026a04-bc52-4982-ad3b-d50eb5d9b4b8)
  - ![image](https://github.com/user-attachments/assets/461f22a3-3a5d-47c2-83cf-9ce27a715fe0)
  - Light mode. ![image](https://github.com/user-attachments/assets/2b24277e-b32b-4e21-be56-2515b0438d98)

To test it out, it's pretty straightforward:

<p>1. Clone the repository</p>

```
git clone https://github.com/benchagraa/badr-luxury.git
```

<p>2. Install the required dependencies </p>

```
npm install
```

<p>3. Start the development server</p>

```
npm run dev
```

<p>4. Access the application at</p>

```
http://localhost:5173/dashboard?last=10
```
<p>4. Log In: </p>

```
Email: bnp@example.com
Password: test123@
```

<p>5. Run tests </p>

```
npm test
```
