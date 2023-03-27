import axios from "axios";

const FetchData = async (obj) => {
  // const controller = new AbortController();
  // console.log(obj);

  const fetching = await axios({
    url: obj.url,
    headers: {
      Authorization: `Bearer ${obj.user.token}`,
    },
    data: obj.data,
    method: obj.method,
    withCredentials: true,
    // signal: controller.signal,
  });
  return fetching.data;
};

export default FetchData;
