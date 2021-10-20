import Head from "next/head";
import React, { useCallback, useState } from "react";
import CategoriesView from "./components/CategoriesView";
import JobView from "./components/JobView";
import CategoryView from "./components/CategoryView";
import { GH_API_ENDPOINTS, JOB_CATEGORIES } from "./constants";
import styles from "../../styles/Home.module.css";

export const fetchGHData = (endpoint: string) => {
  return fetch(endpoint).then((response) => response.json());
};

const Homepage = () => {
  const [selectedCategory, setSelectedCategory] = useState();
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategoryData, setSelectedSubCategoryData] = useState();
  const [jobInfo, setJobInfo] = useState();

  const onCategorySelected = useCallback((category) => {
    setSelectedCategory(category);

    let endpoint;

    switch (category) {
      case JOB_CATEGORIES.offices:
        endpoint = GH_API_ENDPOINTS.offices;
        break;
      case JOB_CATEGORIES.departments:
        endpoint = GH_API_ENDPOINTS.departments;
        break;
      default:
        endpoint = GH_API_ENDPOINTS.jobs;
        break;
    }

    fetchGHData(endpoint).then((res) => setSubCategories(res[category]));
  }, []);

  const onSubCategorySelected = useCallback((subCategory) => {
    setSelectedSubCategoryData(subCategory);
  }, []);

  const onBackFromSubCategoryView = useCallback(() => {
    setSelectedSubCategoryData(undefined);
  }, []);

  const onJobClick = useCallback((job) => {
    setJobInfo(job);
  }, []);

  const onBackFromJobView = useCallback(() => {
    setJobInfo(undefined);
  }, []);

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
