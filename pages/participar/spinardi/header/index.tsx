import BuySubscriptionButton from "pages/participar/components/BuySubscriptionButton";
import Countdown from "pages/participar/components/Countdown";

const Header = ()=>{
    return <>
        <BuySubscriptionButton label="Garanta sua vaga neste cluve exclusivo!"/>
        <Countdown startDate={new Date('2025-01-12')}/>
    </>
}
export default Header;