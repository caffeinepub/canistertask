# Specification

## Summary
**Goal:** Fix the infinite loading spinner on the worker dashboard that prevents content from displaying.

**Planned changes:**
- Fix the infinite loading spinner that blocks the dashboard content below the header
- Add a 5-second timeout to prevent indefinite loading states
- Implement error boundary with retry capability for failed data fetching
- Investigate and fix the root cause of dashboard data fetching failures in useQueries hooks or useActor

**User-visible outcome:** Users can access their worker dashboard without getting stuck on a loading screen. The dashboard loads completely showing task lists and statistics, or displays a clear error message with retry option if loading fails.
