import React, { useEffect, useState } from "react";
import { fetchGHData } from "../Homepage";
import { GH_API_ENDPOINTS, JOB_CATEGORIES } from "../constants";

const getJobsOfDepartmentById = (departmentList, departmentId) => {
  const department = departmentList.find((d) => d.id === departmentId);
  const jobs = department.jobs;

  department.child_ids.forEach((childDepartmentId) => {
    const childJobs = getJobsOfDepartmentById(
      departmentList,
      childDepartmentId
    );
    jobs.push(...childJobs);
  });

  return jobs;
};

const getDepartmentsJobListInOffice = (office) => {
  const departmentList = office.departments;
  const rootDepartments = departmentList.filter(
    (department) => !department.parent_id
  );
  const normalizedDepartmentList = rootDepartments.map((department) => {
    const jobs = getJobsOfDepartmentById(departmentList, department.id);
    return {
      id: department.id,
      name: department.name,
      jobs,
    };
  });
  return normalizedDepartmentList;
};

const getJobListInDepartment = (department) => {
  const jobs = department.jobs;
  department.children.forEach((childDepartment) => {
    const childJobs = getJobListInDepartment(childDepartment);
    jobs.push(...childJobs);
  });
  return jobs;
};

const getOfficeJobListInDepartment = (department, allJobs) => {
  const jobsInDepartment = getJobListInDepartment(department);
  const normalizedOfficeList = [];
  jobsInDepartment.forEach((job) => {
    const jobDetaildInfo = allJobs.find((j) => j.id === job.id);
    jobDetaildInfo.offices.forEach((jobOffice) => {
      const existingOffice = normalizedOfficeList.find(
        (office) => office.id === jobOffice.id
      );
      if (existingOffice) {
        existingOffice.jobs.push(job);
      } else {
        normalizedOfficeList.push({
          id: jobOffice.id,
          name: jobOffice.name,
          jobs: [job],
        });
      }
    });
  });
  return normalizedOfficeList;
};

const SubCategoryView = ({ subCategory, expanded, onClick, onJobClick }) => {
  const jobs = subCategory.jobs;
  if (subCategory.children) {
    jobs.push(...subCategory.children);
  }

  return (
    <>
      <div
        style={{ border: "1px solid pink", cursor: "pointer" }}
        onClick={onClick}
      >
        <div>{subCategory.name}</div>
        <small>{jobs.length} jobs</small>
      </div>
      {expanded && (
        <div style={{ padding: "5px 20px" }}>
          {jobs.map((job) => (
            <li key={job.id} onClick={() => onJobClick(job)}>
              {job.title}
            </li>
          ))}
        </div>
      )}
    </>
  );
};

const CategoryView = ({ categoryName, subCategoriesData, onJobClick }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [expandedDepartmentId, setExpandedDepartmentId] = useState();

  useEffect(() => {
    let subCategoriesNormalizedData;
    if (categoryName === JOB_CATEGORIES.offices) {
      subCategoriesNormalizedData =
        getDepartmentsJobListInOffice(subCategoriesData);
      setSubCategories(subCategoriesNormalizedData);
    } else if (categoryName === JOB_CATEGORIES.departments) {
      fetchGHData(GH_API_ENDPOINTS.jobs).then((allJobs) => {
        subCategoriesNormalizedData = getOfficeJobListInDepartment(
          subCategoriesData,
          allJobs.jobs
        );
        setSubCategories(subCategoriesNormalizedData);
      });
    }
  }, [subCategoriesData]);

  return (
    <>
      <h1>{subCategoriesData.name}</h1>
      <div style={{ width: 400 }}>
        {subCategories?.map((subCategory) => (
          <div key={subCategory.id}>
            <SubCategoryView
              subCategory={subCategory}
              expanded={expandedDepartmentId === subCategory.id}
              onClick={() => setExpandedDepartmentId(subCategory.id)}
              onJobClick={onJobClick}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default CategoryView;
