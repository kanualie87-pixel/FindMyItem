FindMyItem ReadMi File

FindMyItem is a responsive, web-based Lost and Found application designed specifically for the University of Makeni (UNIMAK) Computer Science student department. The platform replaces manual notice boards with a modern, digital solution that allows students to report lost belongings and finders to return them securely.
 

Features
•	Student Authentication: Register and Login using Name, Student ID, and Year of Study.
•	Role-Based Interaction: Distinct interfaces for "Reporters" (those who lost items) and "Finders" (those who found items).
•	Real-time Search: Instantly filter items in the gallery using the dynamic search bar.
•	Local Persistence: Uses Browser LocalStorage to save student accounts and reported items without a backend server.
•	Direct Communication: Integrated WhatsApp API to connect finders with owners instantly and securely.
•	Responsive UI: A "Glassmorphic" design that works perfectly on lab desktops, tablets, and smartphones.
 

Tech Stack
•	Frontend: HTML5, CSS3 (Flexbox & Grid)
•	Logic: JavaScript (ES6+)
•	Data Storage: Browser LocalStorage API
•	Design Style: Glassmorphism / Modern Minimalist

Project Structure
Plaintext
/FindMyItem
│
├── FindMyItem.html    # All-in-one file containing HTML, CSS, and JS
└── README.md          # Documentation and setup instructions

Installation & Usage
1.	Download: Save the FindMyItem.html file to your computer.
2.	Open: Double-click the file to open it in any modern web browser (Chrome, Firefox, or Edge).
3.	Register: Create a new student account using your UNIMAK Student ID.
4.	Login: Use your ID to access the dashboard.
5.	Test:
o	Click "I Lost Something" to post a dummy item.
o	Click "I Found Something" to see your item and test the WhatsApp notification link.

System Architecture
The application follows a Single Page Application (SPA) model. All data processing and view switching happen client-side, making the app incredibly fast and lightweight.

Limitations & Future Scope
•	Current Limit: Data is stored locally in the browser. Clearing browser cache will remove all reports.
•	Future Scope: Integration with a Firebase or MySQL database for centralized cloud storage and department-wide email notifications.

Academic Credit
•	Institution: University of Makeni (UNIMAK)
•	Department: Computer Science
•	Project Type: Web Programming Assignment

