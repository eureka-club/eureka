import useUser from "@/src/useUser";
import useTranslation from "next-translate/useTranslation";
import { AiOutlineEnvironment } from "react-icons/ai";

const RenderCountry = ({userId}:{userId:number}) => {
    const { t } = useTranslation('mediatheque');

    const {
        data: user,
        isLoading: isLoadingUser,
        isSuccess: isSuccessUser,
      } = useUser(userId, {
        enabled: !isNaN(userId),
      });

      return ( 
        <em>
          <AiOutlineEnvironment /> {`${user?.countryOfOrigin ? t(`countries:${user?.countryOfOrigin}`): 'Unknown'}`}
        </em>
      );
  };
  export default RenderCountry;