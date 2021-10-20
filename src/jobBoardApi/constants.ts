export enum JOB_CATEGORIES {
  jobs = "jobs",
  offices = "offices",
  departments = "departments",
}

export const GH_API_ENDPOINTS = {
  jobs: "https://boards-api.greenhouse.io/v1/boards/lightricks/jobs?content=true",
  job: `https://boards-api.greenhouse.io/v1/boards/lightricks/jobs/`,
  offices: "https://boards-api.greenhouse.io/v1/boards/lightricks/offices",
  departments:
    "https://boards-api.greenhouse.io/v1/boards/lightricks/departments?render_as=tree",
};
