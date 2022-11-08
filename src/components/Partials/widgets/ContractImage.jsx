import {useState, useEffect} from "react";

//Config
import {projectFetch} from "../../../../../config/axiosConfig";

//Components
import Image from "../../../../Partials/Image/Image";

//Style
import "./ContractImage.css";

const ContractImage = ({ca, imgURL, imageClassName, withLoader}) => {
  const [contractData, setContractData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    ca && getContractData(ca);
  }, []);

  const LoadingDots = () => (
    <div className="loading-dots">
      <div className="loading-dots--dot"></div>
      <div className="loading-dots--dot"></div>
      <div className="loading-dots--dot"></div>
    </div>
  );

  const getContractData = async (ca) => {
    if (!ca) return;
    setIsLoading(true);
    const path = "/getCollectionsImages";

    const customConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await projectFetch.post(
        path,
        {contractsList: [ca]},
        customConfig
      );
      //console.log("SERVER PROJECTS ICON RESPONSE:", response);

      const {data} = response;
      setContractData(data || {});
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const src =
    contractData && contractData.length === 1
      ? contractData[0]?.projectLogo
      : imgURL
        ? imgURL
        : "";

  const title =
    contractData && contractData.length === 1
      ? contractData[0]?.projectTitle
      : "Unknown Contract";

  return withLoader ? (
    isLoading ? (
      <LoadingDots/>
    ) : (
      <Image
        className={imageClassName ? imageClassName : "collection__icon"}
        src={src}
        title={title}
      />
    )
  ) : contractData ? (
    <Image
      className={imageClassName ? imageClassName : "collection__icon"}
      src={src}
      title={title}
    />
  ) : null;
};
export default ContractImage;
