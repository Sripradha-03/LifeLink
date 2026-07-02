# LifeLink System: Academic Workflow Management

## 1. System Overview
The LifeLink system operates on a **Cross-Functional Workflow Model**, integrating four distinct actors: the **User** (Donor/Requester), the **Blood Center/Camp Organizer**, the **System Logic** (Automated Backend), and the **Administrator**. The workflow is divided into four logical phases ensuring a seamless lifecycle from user onboarding to donation fulfillment.

---

## 2. System Actors (Swimlanes)

| Actor | Role & Responsibility |
| :--- | :--- |
| **User** | End-users who register as donors or request blood during emergencies. |
| **Blood Center / Camp** | Operational entities responsible for managing blood stock inventory and organizing donation camps. |
| **System Logic** | The automated backend (Node.js/PostgreSQL) that handles data validation, matching algorithms (PostGIS), and notifications. |
| **Administrator** | The oversight authority responsible for verifying users, approving camps, and managing system integrity. |

---

## 3. Detailed Process Flow

### Phase 1: Registration & Onboarding
This phase ensures that only verified and eligible users enter the system.
1.  **Registration**: The User submits a registration form with personal and medical details.
2.  **Data Validation**: The System Logic validates the input against the database schema (e.g., unique mobile number, valid age).
3.  **Pending Storage**: Validated data is stored in the `DONORS` table with a `status='Pending'`.
4.  **Admin Review**: The Administrator reviews the application for authenticity.
    *   **Decision (Yes)**: The account is activated, and a JWT token is generated.
    *   **Decision (No)**: The application is rejected.
5.  **Notification**: The system sends an email/SMS notification regarding the approval status.

### Phase 2: Inventory & Camp Management
This phase manages the supply side of the blood donation ecosystem.
1.  **Inventory Update**: Blood Centers log in to update their stock levels (Add/Remove units) in the `BLOOD_STOCKS` table.
2.  **Camp Organization**: Organizers submit details for upcoming blood donation camps.
3.  **Geo-Tagging**: The System automatically processes the address into Latitude/Longitude coordinates using the Geolocation API.
4.  **Camp Approval**: The Administrator verifies the organization and approves the camp.
5.  **Event Publishing**: The camp is made visible on the public map and notified to nearby donors.

### Phase 3: Emergency Response & Matching
This is the critical core of the system, handling real-time life-saving requests.
1.  **Emergency Request**: A User submits a request for blood (Group + Location).
2.  **Matching Algorithm**: The System executes a **PostGIS Spatial Query** to find:
    *   Donors with compatible blood groups.
    *   Donors within a 10km radius of the request location.
    *   Donors who are currently `Active` (eligible).
3.  **Notification Service**: The System triggers the Twilio API to send immediate SMS alerts to the matched donors.
4.  **Donor Acceptance**: Donors receive the alert and choose to "Accept" the request via the mobile app/link.
5.  **Status Update**: The request status is updated to `In Progress` in the `BLOOD_REQUESTS` table.

### Phase 4: Fulfillment & Lifecycle Management
This phase closes the loop and maintains data integrity for future cycles.
1.  **Donation Process**: The donor arrives at the hospital/center, and the donation is verified.
2.  **Request Closure**: The Administrator or Requester marks the request as `Completed`.
3.  **History Update**: The System updates the donor's history with the new donation date.
4.  **Auto-Deactivation**: The System automatically sets the donor's `isActive` status to `False`.
    *   **Cooling Period**: A scheduled task prevents reactivation for 3 months (Male) or 4 months (Female) to ensure donor health safety.

---

## 4. Technical Implementation Summary
*   **Backend**: Node.js with Express.js
*   **Database**: PostgreSQL with Sequelize ORM
*   **Geospatial Engine**: PostGIS for location-based matching
*   **Notification**: Twilio SMS API
*   **Security**: BCrypt for password hashing and JWT for session management
