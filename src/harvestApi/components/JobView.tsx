import { useRouter } from "next/router";
import React, { useEffect } from "react";

const JobView = ({ job, onBack }) => {
  const router = useRouter();
  const { gh_src } = router.query;

  useEffect(() => {
    Grnhse.Iframe.load(job.id, gh_src);
  }, [job]);

  return (
    <>
      <h1>{job.title}</h1>
      <section>
        <div
          contentEditable
          dangerouslySetInnerHTML={{ __html: job.content }}
        />
      </section>
      <div id="grnhse_app"></div>
      <h3 onClick={onBack}>Back</h3>
    </>
  );
};

export default JobView;
