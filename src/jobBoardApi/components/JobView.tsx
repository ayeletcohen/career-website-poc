import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { GH_API_ENDPOINTS } from "../constants";

const htmlDecode = (input) => {
  var e = document.createElement("div");
  e.innerHTML = input;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
};

const JobView = ({ job, onBack }) => {
  const [fullJobInfo, setFullJobInfo] = useState({});

  const router = useRouter();
  const { gh_src } = router.query;

  useEffect(() => {
    fetch(GH_API_ENDPOINTS.job + job.id)
      .then((response) => response.json())
      .then((jobInfo) => setFullJobInfo(jobInfo));
    Grnhse.Iframe.load(job.id, gh_src);
  }, [job]);

  return (
    <>
      <h1>{job.title}</h1>
      <section>
        <div
          contentEditable
          dangerouslySetInnerHTML={{ __html: htmlDecode(fullJobInfo.content) }}
        />
      </section>
      <div id="grnhse_app"></div>
      <h3 onClick={onBack}>Back</h3>
    </>
  );
};

export default JobView;
