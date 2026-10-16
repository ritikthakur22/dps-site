import "server-only";
import { revalidatePath } from "next/cache";

/** Rebuilds every public page on the next visit, so saved changes are live within seconds. */
export function publish() {
  revalidatePath("/", "layout");
}
