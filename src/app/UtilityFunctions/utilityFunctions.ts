export function MapUserFormToResource(userform: any) {
    return {
        empId: userform?.empId,
        name: userform?.name,
        email: userform?.email,
        designation: userform?.designation,
        reportingTo: Array.isArray(userform?.reportingTo) ? userform.reportingTo.join(",") : userform.reportingTo,
        billable: userform?.billable === 'yes',
        skill: Array.isArray(userform?.skill) ? userform.skill.join(",") : userform.skill,
        project: Array.isArray(userform?.project) ? userform.project.join(",") : userform.project,
        location: userform?.location,
        doj: userform?.doj, 
        remarks: userform?.remarks,
    }
}