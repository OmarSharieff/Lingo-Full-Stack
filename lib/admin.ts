import { auth } from "@clerk/nextjs/server"

const allowedIds = [
  "user_2fpMCmYlEBkLvdgrvhjaTK2ZHVI"
]

export const isAdmin = () => {
  const {userId} = auth();

  if (!userId) return false;

  return allowedIds.indexOf(userId) !== -1;
}