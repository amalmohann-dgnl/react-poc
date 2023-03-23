import { useEffect, FunctionComponent, useState } from "react";
import { endp as endpoint } from "../../../configs/endpoint-url";
import AxiosRequester from "../../../services/AxiosRequester";
import {
  RailDataResponse,
  Content,
  Image,
} from "../../../models/api-request-response/rail-data.response";
import railName from "../../../configs/rail-name";
import theme from "../../../configs/theme";
import { Carousal } from "../../molecule/virtualized-carousel/VirtualizedCaroual";
import RailItem from "../../molecule/RailItem/RailItem";

interface IRailProps {
  railIndex: number;
}

const Rail: FunctionComponent<IRailProps> = (props) => {
  const { railIndex } = props;

  // const [index, setIndex] = useState<number>(-1)
  const [dataLength, setDataLength] = useState<number>(0);
  const [responseData, setResponseData] = useState<RailDataResponse>();
  const [data, setData] = useState<Content[]>([]);
  const [rail, setRail] = useState<
    Array<{ label: string; thumbnail: string | undefined }>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const axiosRequester = new AxiosRequester();

  useEffect(() => {
    setIsLoading(true);
    const railItems: Array<{ label: string; thumbnail: string | undefined }> =
      [] as Array<{ label: string; thumbnail: string | undefined }>;
    axiosRequester.fetch(endpoint[railIndex]!).then((response) => {
      if (response) {
        setResponseData(response[0]?.data);
        setDataLength(responseData?.totalElements || 0);
        setData(responseData?.content || []);
        for (let i = 0; i < dataLength; i++) {
          let label = data[i]?.title;
          let img_thumbnail = data[i]?.images.find(
            (img: Image) => img.width === 288
          )?.url;
          railItems.push({ label: label, thumbnail: img_thumbnail });
        }
        setRail(railItems);
        setIsLoading(false)
      }
      // setIndex(0);
    });
  }, []);

  if (isLoading) {
    <div> Is Loading...</div>;
  }

  return (
    <div>
      <h3 style={{ color: theme.colors.white }}>{railName[railIndex]}</h3>
      <Carousal data={rail} Item={RailItem} />
    </div>
  );
};

export default Rail;
