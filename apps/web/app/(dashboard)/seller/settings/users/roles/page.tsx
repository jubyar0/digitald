import { getStoreRoles } from "@/actions/seller-users"
import RolesClient from "./roles-client"

export const dynamic = 'force-dynamic'

export default async function RolesPage() {
    const rolesResult = await getStoreRoles()
    const roles = rolesResult.success ? rolesResult.data || [] : []

    return <RolesClient initialRoles={roles} />
}
