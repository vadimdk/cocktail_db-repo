import React from 'react';

import { 
   StyleSheet,
   Text, 
   View,
   TouchableOpacity,
   ActivityIndicator,
   FlatList,
  Image,
  ScrollView,
  
  } from 'react-native';

import { CheckBox,  } from 'react-native-elements';


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';




class Drinks extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      list: [],
      isLoading: true,

    };


  }


  componentDidMount() {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Ordinary Drink')
      .then((response) => response.json())
      .then((json) => {
        this.setState({ list: json.drinks });
        console.log("state.data:", this.state.list);
        
      })

      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });


  }


 
  render () {

    const { isLoading, list } = this.state;
    console.log(this.props.route);
    const { navigation } = this.props;
    const { params: filters } = this.props.route;
    
    
return (
  <ScrollView>
  <View>
    <Text>
      Drinks
    </Text>
   
    <View style={{ flex: 1, padding: 5, }}>

      {isLoading ? <ActivityIndicator /> : (
        <FlatList

          data={list}
          keyExtractor={(item) => item.id}

          renderItem={({ item, id }) => (

           

            <Text style={{ paddingLeft: 15, marginLeft: 10, marginBottom: 5, display: 'flex', flexDirection: 'row-reverse', justifyContent: "flex-end" }}>
              {item.strDrink}

              <Image
                style={styles.tinyLogo}
                source={{ uri: item.strDrinkThumb }}
              />

            </Text>

          )}

        />
      )}
    </View>

     
    <TouchableOpacity onPress={() => navigation.navigate("Filters")}>
      <Text>
        Go to Filters
      </Text>
    </TouchableOpacity>
  </View>
  </ScrollView>
)
  }
}

class Filters extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      data: [],
      isLoading: true,
      currentstrCategory: ''
    };

   
  }

  
  
  componentDidMount() {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list')
      .then((response) => response.json())
      .then((json) => {
        this.setState({ data: json.drinks });
        console.log("state.data:", this.state.data)
        this.list = this.state.data;

        const newArray = [...this.state.data];
        
        
        newArray.map(function (item, index) {
          item.isChecked = false;
          item.id = index.toString();
          console.log("newArray:", newArray);
          
        });
        
        this.setState({ data: newArray, isLoading: false});
        console.log(this.state.data);

      })
   
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
   
   
  }

 


  onCheck = (id) => {
   
    this.setState( ({ data }) => ({
      data: data.map((data) => data.id === id ? ({ ...data, isChecked: !data.isChecked }) : { ...data })
         }));
    
    console.log("pressed:", id);
    console.log(this.state.currentstrCategory);
  }

  drinkSet = (data) => {
    this.setState(({ currentstrCategory }) =>  ({currentstrCategory: data.isChecked === true ? data.strCategory : ''}))
  }

       
  render () {
  
    const {  isLoading } = this.state;
    
    console.log(this.state.data);

    const { currentstrCategory } = this.state;

    console.log(currentstrCategory);
  
    const { navigation } = this.props;
    
    return (
  <ScrollView>
  <View>
    <Text>
      Filters
    </Text>
  
     <View style={{ flex: 1, padding: 5,  }}>
      
        {isLoading ? <ActivityIndicator/> : ( 
            <FlatList
          
                  data={this.state.data}
                  keyExtractor={(item) => item.id}
         
                  renderItem={({item, id}) => (

                          <Text style={{ paddingLeft: 15,   marginBottom: 5, display: 'flex',   justifyContent: "space-between" }}>
                           {item.strCategory}

                      <CheckBox
                     
                        itemId={item.id}
                        value={item.strCategory}
                        checked={item.isChecked}
                        onPress={() => this.onCheck(item.id)}
                       
                      />

                    </Text>
                    
                  )}
          
            />
        )}
     </View>

    <TouchableOpacity onPress={() => navigation.navigate("Drinks", { message: "Hello from Filter" })} style={ styles.centered }>
      <Text style={ styles.button }  onPress={() => this.drinkSet}>
        Apply
      </Text>
    </TouchableOpacity>
        </View>
        </ScrollView>
  
)
  }
}

const FilterButton = ({navigation}) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Filters")}>
    <Image 
        style={{ width: 20, height: 20, marginRight: 10 }}
        source={require('./assets/filter.png')} />
</TouchableOpacity >
  )
}



const Stack = createStackNavigator();

export default function App(props) {
  
  const { navigation } = this.props;
 

  
  return (
    
   <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Drinks" component={Drinks} 
        
          options={{
           
            headerRight: () => (
              
              <FilterButton navigation={navigation}/>
             
            ),
        
          }}

        />
        <Stack.Screen name="Filters" component={Filters} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    backgroundColor: 'green',
    alignItems: 'flex-start',
    justifyContent: 'center',
    
  },
text: {
  fontSize: 45,
  fontStyle: 'italic',
  fontWeight: 'bold',
  color: 'red'
},

button: {
  
  width: 360,
  height: 45,
  marginTop: 5,
  marginLeft: 7,
  paddingTop: 5,
  borderRadius: 5,
  color: 'white',
  textAlign: 'center',
  fontSize: 20,
  backgroundColor: '#272727',
},

  tinyLogo: {
    width: 50,
    height: 50,
    marginRight: 15,
  },

  centered: {
    display: 'flex',
    justifyContent: "center",
  },

});
