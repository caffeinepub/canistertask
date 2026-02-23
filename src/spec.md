# Specification

## Summary
**Goal:** Add a complete user profile page that displays worker statistics, earnings, task history, and is accessible via navigation menu.

**Planned changes:**
- Create new 'My Profile' page at route /perfil showing user name, star rating with completed tasks count, location (5km radius), skills list, hourly and per-task pricing, total earnings with 7% platform fee indication, today's earnings, completed/pending task counts, and recent task history with relative timestamps
- Add 'Edit Profile' and 'Stats Analytics' action buttons to profile page
- Create public profile URLs at /perfil/[user-id] viewable by authenticated users and admin
- Add backend query method to retrieve profile data with calculated rating, earnings (7% fee), and task history
- Update main navigation menu to include 'MEU PERFIL' link between 'Tasks' and 'Admin'
- Ensure admin dashboard displays platform earnings with 7% fee clearly indicated

**User-visible outcome:** Users can navigate to their profile page to view comprehensive statistics including earnings, ratings, and task history. Admin users can view any user's profile. The navigation menu now includes a 'MEU PERFIL' link for easy access.
