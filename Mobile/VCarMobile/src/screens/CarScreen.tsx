import { View, Text, TextInput } from 'react-native';
import React, { useMemo, useRef } from 'react';
import LayoutMain from '../layouts/LayoutMain';
import { Button, Icon, SearchBar } from 'react-native-elements';
import FilterPopup from '../modules/car/FilterPopup';
import { QuerySearchCar } from '../store/car/models';
import { useDispatch, useSelector } from 'react-redux';
import { GET_CARS } from '../store/car/action';
import { debounce } from 'lodash';
import CarCard from '../components/common/CarCard';
import { ICar } from '../store/car/types';
import CardSkeleton from '../components/common/CardSkeleton';
import { RootState } from '../store/configureStore';


const CarScreen = () => {
    const [search, setSearch] = React.useState('');
    const [filterVisible, setFilterVisible] = React.useState(false);
    const [searchParams, setSearchParams] = React.useState({ ...QuerySearchCar })
    const { cars, loading } = useSelector((state: RootState) => state.car);
    const dispatch = useDispatch();
    const searchKeyWordDebounce = debounce(() => {
        setSearchParams({ ...searchParams, query: search });
    }, 500);

    useMemo(() => {
        dispatch({ type: GET_CARS, payload: searchParams })
    }, [searchParams])

    useMemo(() => {
        searchKeyWordDebounce()
    }, [search])

    return (
        <LayoutMain>
            <View className="flex-row items-center justify-between p-4 bg-white">
                {/* Search Input */}
                <View className="flex-row items-center flex-1 px-4 py-2 mr-4 bg-gray-200 rounded-full">
                    <Icon
                        name="search"
                        type="feather"
                        size={20}
                        color="#9CA3AF"
                    />
                    <TextInput
                        className="flex-1 w-full h-10 ml-2 text-text2"
                        placeholder="Search car..."
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* Filter Button */}
                <Button
                    icon={
                        <Icon
                            name="filter"
                            type="feather"
                            size={24}
                            color="white"
                        />
                    }
                    buttonStyle={{ backgroundColor: '#3B82F6', borderRadius: 50 }}
                    onPress={() => setFilterVisible(true)}
                />
            </View>
            <View className="flex flex-wrap p-4">
                {!loading && cars.length === 0 && <Text>No Car Result</Text>}
                {!loading && cars.length > 0 && cars.map((car: ICar) => (
                    <CarCard key={car.id} car={car} isFullWidth />
                ))}
                {loading && Array.from({ length: 10 }).map((_, index) => (
                    <CardSkeleton
                        key={index}
                        isFullWidth
                    ></CardSkeleton>
                ))}
            </View>
            {!loading && cars.length > 0 && (<Button
                title="Load More"
                buttonStyle={{ backgroundColor: '#3B82F6', borderRadius: 10, margin: 10 }}
                onPress={() => setSearchParams({ ...searchParams, size: searchParams.size + 10 })}
            />)}

            <FilterPopup isVisible={filterVisible} toggleDialog={() => setFilterVisible(!filterVisible)} searchParams={searchParams} setSearchParams={setSearchParams} />
        </LayoutMain>
    );
};

export default CarScreen;