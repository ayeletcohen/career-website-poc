import React, { useEffect, useState } from "react";
import { JOB_HARVEST_CATEGORIES } from "../constants";

const SubCategoryView = ({ subCategory, expanded, onClick, onJobClick }) => {
  const jobs = subCategory.jobs;

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
    if (categoryName === JOB_HARVEST_CATEGORIES.offices) {
      setSubCategories(subCategoriesData.departments);
    } else if (categoryName === JOB_HARVEST_CATEGORIES.departments) {
      setSubCategories(subCategoriesData.offices);
    }
  }, [subCategoriesData]);

  return (
    <>
      <h1>{subCategoriesData.name}</h1>
      <div style={{ width: 400 }}>
        {subCategories.map((subCategory) => (
          <div key={subCategory.id}>
            <SubCategoryView
              subCategory={subCategory}
              expanded={expandedDepartmentId === subCategory.id}
              onClick={() => setExpandedDepartmentId(subCategory.id)}
              onJobClick={onJobClick}
            />
          </div>
        ))}
        <img src="/images/halloween-desktop.jpg" />
      </div>
    </>
  );
};

export default CategoryView;
