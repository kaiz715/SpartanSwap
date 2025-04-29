/**
 * Root Page Component
 * 
 * Renders the HomePage component at the root ("/") route of the SpartanSwap application.
 * 
 * Features:
 * - Serves as the main landing page.
 * - Delegates all layout, styling, and interactive elements to the HomePage component.
 * 
 * Notes:
 * - This is a minimal server component that simply returns the HomePage.
 */

import HomePage from "./components/homepage";


export default function Page() {
  return <HomePage />;
}