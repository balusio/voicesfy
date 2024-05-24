import {
  UseQueryOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { useEffect, useState } from "react";
import LoginService from "services/login";
import { updateAuth } from "store/auth";

const useAuthQuery = (useQueryProps: UseQueryOptions) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [shouldTriggerRefresh, setShouldTriggerRefresh] = useState(false);
  const [dispatchAPIQuery, setDispatchAPIQuery] = useState(false);

  const { data, isSuccess } = useQuery({
    queryKey: ["refresh"],
    queryFn: async () => {
      console.log("CHECKING REFRESH EVENT");
      const querytoken = await LoginService.refreshToken();
      return querytoken;
    },
    enabled: shouldTriggerRefresh,
  });

  const queryResult = useQuery({
    ...useQueryProps,
    enabled: dispatchAPIQuery,
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(
        updateAuth({
          accessToken: data.access,
          refreshToken: data.refresh,
        })
      );
      setDispatchAPIQuery(true);
      setShouldTriggerRefresh(false);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    console.log("invoked for => ", useQueryProps.queryKey);
    const validateToken = async () => {
      const session = await LoginService.getCurrentToken();
      if (session) {
        let token = session;
        if (LoginService.isTokenExpired(token)) {
          queryClient.invalidateQueries({ queryKey: ["refresh"] });
          setShouldTriggerRefresh(true);
        }

        dispatch(
          updateAuth({
            accessToken: token.access,
            refreshToken: token.refresh,
          })
        );
        setDispatchAPIQuery(true);
      } else {
        dispatch(
          updateAuth({
            accessToken: null,
            refreshToken: null,
          })
        );
        LoginService.logout();
      }
    };

    validateToken();
  }, []);

  return queryResult;
};

export default useAuthQuery;
