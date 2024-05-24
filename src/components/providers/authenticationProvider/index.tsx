import { useAppSelector } from "hooks";
import { getAuth } from "store/auth";
import { useEffect, useState } from "react";
import { useAppDispatch } from "hooks";
import { updateAuth } from "store/auth";
import Login from "pages/login";
import LoginService from "services/login";
import { FullPageSpin } from "components/fullPageSpin";

interface AuthenticationProviderProps {
  children: JSX.Element | JSX.Element[];
}

export function AuthenticationProvider({
  children,
}: AuthenticationProviderProps) {
  const auth = useAppSelector(getAuth);
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const handleValidation = async () => {
  //     setIsLoading(true);
  //     const session = await LoginService.getCurrentToken();

  //     if (session) {
  //       let token = session;
  //       if (LoginService.isTokenExpired(token)) {
  //         try {
  //           const refreshedToken = await LoginService.refreshToken();
  //           if (refreshedToken) {
  //             token = refreshedToken;
  //           }
  //         } catch (e) {
  //           console.error(e);
  //           LoginService.logout();
  //         }
  //       }

  //       dispatch(
  //         updateAuth({
  //           accessToken: token.access,
  //           refreshToken: token.refresh,
  //         })
  //       );
  //     } else {
  //       dispatch(updateAuth({ accessToken: null, refreshToken: null }));
  //     }
  //     setIsLoading(false);
  //   };

  //   handleValidation();
  // }, []);

  if (isLoading) {
    return (
      <>
        <FullPageSpin />
      </>
    );
  }

  return <>{auth.accessToken ? children : <Login />}</>;
}
