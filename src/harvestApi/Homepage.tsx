import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import CategoriesView from "./components/CategoriesView";
import JobView from "./components/JobView";
import CategoryView from "./components/CategoryView";
import { JOB_HARVEST_CATEGORIES } from "./constants";
import styles from "../../styles/Home.module.css";

const Homepage = ({ jobList, jobs, offices, departments }) => {
  const [selectedCategory, setSelectedCategory] = useState();
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategoryData, setSelectedSubCategoryData] = useState();
  const [jobInfo, setJobInfo] = useState();

  useEffect(() => console.log("@@@ ~ jobList", jobList), [jobList]);
  useEffect(() => console.log("@@@ ~ jobs", jobs), [jobs]);
  useEffect(() => console.log("@@@ ~ offices", offices), [offices]);
  useEffect(() => console.log("@@@ ~ departments", departments), [departments]);

  const onCategorySelected = useCallback(
    (category) => {
      setSelectedCategory(category);

      switch (category) {
        case JOB_HARVEST_CATEGORIES.offices:
          setSubCategories(offices);
          break;
        case JOB_HARVEST_CATEGORIES.departments:
          setSubCategories(departments);
          break;
        default:
          setSubCategories(jobList);
          break;
      }
    },
    [offices, departments, jobs, jobList]
  );

  const onSubCategorySelected = useCallback(
    (subCategory) => setSelectedSubCategoryData(subCategory),
    []
  );

  const onBackFromSubCategoryView = useCallback(
    () => setSelectedSubCategoryData(undefined),
    []
  );

  const onJobClick = useCallback((job) => setJobInfo(job), []);

  const onBackFromJobView = useCallback(() => setJobInfo(undefined), []);

  return (
    <>
      <Head>
        <script
          async
          src="https://boards.greenhouse.io/embed/job_board/js?for=lightricks"
        ></script>
      </Head>

      <div className={styles.container}>
        {!jobInfo ? (
          <>
            {!selectedSubCategoryData ? (
              <CategoriesView
                onCategorySelected={onCategorySelected}
                selectedCategory={selectedCategory}
                subCategories={subCategories}
                onSubCategorySelected={onSubCategorySelected}
              />
            ) : (
              <>
                <CategoryView
                  categoryName={selectedCategory}
                  subCategoriesData={selectedSubCategoryData}
                  onJobClick={onJobClick}
                />
                <h3 onClick={onBackFromSubCategoryView}>Back</h3>
              </>
            )}
          </>
        ) : (
          <JobView job={jobInfo} onBack={onBackFromJobView} />
        )}
      </div>
    </>
  );
};

export default Homepage;
