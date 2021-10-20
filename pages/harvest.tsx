import type { NextPage } from "next";
import React from "react";
import Homepage from "../src/harvestApi/Homepage";

const GH_HARVEST_API_ENDPOINTS = {
  jobPosts: "https://harvest.greenhouse.io/v1/job_posts?active=true&live=true",
  jobs: "https://harvest.greenhouse.io/v1/jobs?status=open",
  job: "https://harvest.greenhouse.io/v1/job_posts/",
  offices: "https://harvest.greenhouse.io/v1/offices?render_as=tree",
  departments: "https://harvest.greenhouse.io/v1/departments?render_as=tree",
};

const Home: NextPage = (props) => {
  return <Homepage {...props} />;
};

export const fetchGHData = (endpoint: string) => {
  return fetch(endpoint, {
    headers: {
      Authorization: "Basic NmQzYWMxMjc0ZTg5OTE4MDc3N2FlMTU1YjE3NzBhNjQtMjo=",
    },
  }).then((response) => response.json());
};

export async function getStaticProps() {
  const jobList = (await fetchGHData(GH_HARVEST_API_ENDPOINTS.jobPosts)).filter(
    (jobPost) => !!jobPost.external
  );
  const jobs = await fetchGHData(GH_HARVEST_API_ENDPOINTS.jobs);
  const offices_res = await fetchGHData(GH_HARVEST_API_ENDPOINTS.offices);
  const departments_res = await fetchGHData(
    GH_HARVEST_API_ENDPOINTS.departments
  );

  const offices = [];
  const departments = [];

  const filterJobsOfDepartment = (jobs, department) =>
    jobs.filter((job) => {
      const jobDepartmentId = job.departments[0].id;
      if (
        jobDepartmentId === department.id ||
        department.children.find((child) => child.id === jobDepartmentId)
      ) {
        return true;
      }
      return false;
    });

  offices_res.forEach((office) => {
    const officeJobs = jobs.filter((job) => job.offices[0].id === office.id);

    // Merge departments info into the office list
    const officeDepartments = [];
    departments_res.forEach((department) => {
      // Merge job posts info into the office list (inside departments)
      const officeDepartmentJobs = filterJobsOfDepartment(
        officeJobs,
        department
      );

      const childJobPosts = officeDepartmentJobs.flatMap((job) => {
        // Find job posts that belong to this job
        return jobList.filter((jobPost) => jobPost["job_id"] === job.id);
      });

      officeDepartments.push({
        ...department,
        jobs: childJobPosts,
      });
    });

    offices.push({
      ...office,
      departments: officeDepartments,
    });
  });

  // Merge offices info into the department list
  departments_res.forEach((department) => {
    const departmentJobs = filterJobsOfDepartment(jobs, department);

    // Merge offices info into the departments list
    const departmentOffices = [];
    offices_res.forEach((office) => {
      // Merge job posts info into the department list (inside offices)
      const departmentOfficeJobs = departmentJobs.filter(
        (departmentJob) => departmentJob.offices[0].id === office.id
      );

      const childJobPosts = departmentOfficeJobs.flatMap((job) => {
        // Find job posts that belong to this job
        return jobList.filter((jobPost) => jobPost["job_id"] === job.id);
      });

      departmentOffices.push({
        ...office,
        jobs: childJobPosts,
      });
    });

    departments.push({
      ...department,
      offices: departmentOffices,
    });
  });

  return {
    props: {
      jobList,
      jobs,
      offices,
      departments,
    },
  };
}

export default Home;
