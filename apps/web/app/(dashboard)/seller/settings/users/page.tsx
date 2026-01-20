import { getStoreUsers, getStoreRoles } from "@/actions/seller-users"
import UsersClient from "./users-client"

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
    const [usersResult, rolesResult] = await Promise.all([
        getStoreUsers(),
        getStoreRoles()
    ])

    const users = usersResult.success ? usersResult.data || [] : []
    const roles = rolesResult.success ? rolesResult.data || [] : []

    return <UsersClient initialUsers={users} roles={roles} />
}
