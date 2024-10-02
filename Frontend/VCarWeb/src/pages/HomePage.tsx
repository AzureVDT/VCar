
import Banner from "../modules/home/Banner";
import CarSession from "../modules/home/CarSession";
import FilterCar from "../modules/home/FilterCar";

const HomePage = () => {
  return (
    <div>
      <Banner></Banner>
      <FilterCar></FilterCar>
      <CarSession title="Popular" type="popular"></CarSession>
      <CarSession title="Recommendation" type="recommend"></CarSession>
      <CarSession title="Near you" type="near"></CarSession>
    </div>
  );
};

export default HomePage;