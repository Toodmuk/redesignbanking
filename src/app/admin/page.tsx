// Direct URL access to admin (for team use during demo)
// The main hidden trigger is: tap the KTB logo on the home screen 5× quickly
import { redirect } from "next/navigation";

export default function AdminRedirect() {
  redirect("/");
}
