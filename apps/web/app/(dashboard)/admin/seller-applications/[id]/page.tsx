import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getVendorApplicationById } from '@/actions/admin-vendor-applications'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ApplicationHeader from '../_components/application-header'
import ApplicationOverview from '../_components/application-overview'
import ApplicationSteps from '../_components/application-steps'
import ApplicationNotes from '../_components/application-notes'
import ApplicationAuditLog from '../_components/application-audit-log'
import PersonaPanel from '../_components/persona-panel'
import AdminActionPanel from '../_components/admin-action-panel'

interface PageProps {
    params: {
        id: string
    }
}

async function ApplicationDetails({ id }: { id: string }) {
    const result = await getVendorApplicationById(id)

    if (!result.success || !result.data) {
        notFound()
    }

    const application = result.data

    return (
        <div className="space-y-6">
            <ApplicationHeader application={application} />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="steps">Steps</TabsTrigger>
                            <TabsTrigger value="notes">
                                Notes ({application.applicationNotes.length})
                            </TabsTrigger>
                            <TabsTrigger value="persona">Persona</TabsTrigger>
                            <TabsTrigger value="audit">
                                Audit Log ({application.auditLogs.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-6">
                            <ApplicationOverview application={application} />
                        </TabsContent>

                        <TabsContent value="steps" className="mt-6">
                            <ApplicationSteps
                                applicationId={application.id}
                                steps={application.steps}
                                currentStep={application.currentStep}
                            />
                        </TabsContent>

                        <TabsContent value="notes" className="mt-6">
                            <ApplicationNotes
                                applicationId={application.id}
                                notes={application.applicationNotes}
                            />
                        </TabsContent>

                        <TabsContent value="persona" className="mt-6">
                            <PersonaPanel
                                applicationId={application.id}
                                application={application}
                            />
                        </TabsContent>

                        <TabsContent value="audit" className="mt-6">
                            <ApplicationAuditLog logs={application.auditLogs} />
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <AdminActionPanel application={application} />
                </div>
            </div>
        </div>
    )
}

export default function ApplicationDetailPage({ params }: PageProps) {
    return (
        <Suspense
            fallback={
                <div className="space-y-6">
                    <Skeleton className="h-32 w-full" />
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <Skeleton className="h-96 w-full" />
                        </div>
                        <div>
                            <Skeleton className="h-64 w-full" />
                        </div>
                    </div>
                </div>
            }
        >
            <ApplicationDetails id={params.id} />
        </Suspense>
    )
}
