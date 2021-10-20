import React from "react";
import { JOB_HARVEST_CATEGORIES } from "../constants";

const CategoriesView = ({
  onCategorySelected,
  selectedCategory,
  subCategories,
  onSubCategorySelected,
}) => {
  return (
    <>
      <section>
        <button
          onClick={() => onCategorySelected(JOB_HARVEST_CATEGORIES.offices)}
        >
          Offices
        </button>
        <button
          onClick={() => onCategorySelected(JOB_HARVEST_CATEGORIES.departments)}
        >
          Departments
        </button>
        <button onClick={() => onCategorySelected(JOB_HARVEST_CATEGORIES.jobs)}>
          All jobs
        </button>
      </section>
      <h1 style={{ textTransform: "capitalize" }}>{selectedCategory}</h1>
      <div style={{ overflow: "scroll" }}>
        {subCategories.map((subCategory) => (
          <div
            key={subCategory.id}
            style={{ cursor: "pointer" }}
            onClick={() => onSubCategorySelected(subCategory)}
          >
            {subCategory.name ?? subCategory.title}
          </div>
        ))}
      </div>
    </>
  );
};

export default CategoriesView;
