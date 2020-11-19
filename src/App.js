import React from 'react';

import './css/style.css';
import './css/bootstrap.min.css'
import './App.css';
import MerchantDetail from './MerchantDetail'

class App extends React.Component {
  state = {
    // isLoading: true,
    jsonData: null,
    filterKeyCategory: 'all',
  }
  componentDidMount = async () => {
    fetch('https://panjs.com/ywc18.json')
      .then(response => response.json())
      .then((jsonData) => {
        console.log(jsonData)
        jsonData.categories.push({name: 'งานบริการอื่นๆ / เบ็ดเตล็ด', subcategories: []})
        jsonData.merchants.push({
          addressDistrictName: "เขตลาดกระบัง",
          addressProvinceName: "กรุงเทพมหานคร",
          categoryName: "ร้านอาหาร",
          coverImageId: "https://www.saphanmai.com/wp-content/uploads/2019/03/49895510_2247234235565577_2936877454226096128_o.jpg",
          highlightText: "บุฟเฟ่ต์สุกี้<strong>แบบไม่อั้น</strong>ในราคา 199 บาท",
          isOpen: "Y",
          priceLevel: 1,
          recommendedItems: ["หมูกระทะ", "สุกี้"],
          shopNameTH: "สุกกี้ตี๋น้อย",
          subcategoryName: "ชาบู สุกี้ยากี้ หม้อไฟ",
        })
        this.setState({
          isLoading: false,
          jsonData: jsonData,
          merchantsFiltered: jsonData.merchants,
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  filterCategory = () => {
    const { jsonData } = this.state;
    let categoryOptions = () => {
      if (!!jsonData) {
        const { categories } = jsonData;
        let options = categories.map((category, i) => {
          return (
            <div key={i}>
              <input 
                type="radio" name="filterKeyCategory" 
                id={category.name} value={category.name} 
                onChange={this.handleFilterCategory}
              />
              <label htmlFor={category.name} className="ml-1">{category.name}</label>
            </div>
          )
        })
        return options
      }
    }    
    return (
      <div className="filter" style={{marginBottom: '17px'}}>
        <label className="filter-name">ประเภทร้านค้า</label>
        <div>
          <input 
            type="radio" name="filterKeyCategory" id="allcategories" 
            value="all" onChange={this.handleFilterCategory} defaultChecked
          />
          <label htmlFor="allcategories" className="ml-1">ทั้งหมด</label>
        </div>
        {categoryOptions()}
      </div>
    )
  }

  handleFilterChange = () => {
    const { jsonData, filterKeyCategory, filterKeySubcatagory } = this.state
    const { merchants } = jsonData
    let merchantsFiltered = []
    if (filterKeyCategory === 'all') {
      merchantsFiltered = merchants
    } else if (filterKeyCategory === 'ร้านอาหารและเครื่องดื่ม') {
      merchantsFiltered = merchants.filter((item) => {
        return (item.categoryName===filterKeyCategory || item.categoryName==='ร้านอาหาร' || item.categoryName==='ร้านเครื่องดื่ม')
      })
      if (filterKeySubcatagory !== 'all') {
        merchantsFiltered = merchantsFiltered.filter((item) => {
          return (item.subcategoryName===filterKeySubcatagory)
        })
      }
    } else if (filterKeyCategory === 'สินค้าทั่วไป') {
      merchantsFiltered = merchants.filter((item) => {
        return (item.categoryName===filterKeyCategory || item.categoryName==='แฟชั่น')
      })
      if (filterKeySubcatagory !== 'all') {
        merchantsFiltered = merchantsFiltered.filter((item) => {
          return (item.subcategoryName===filterKeySubcatagory)
        })
      }
    } else {
      merchantsFiltered = merchants.filter((item) => {
        return (item.categoryName===filterKeyCategory)
      })
      if (filterKeySubcatagory !== 'all') {
        merchantsFiltered = merchantsFiltered.filter((item) => {
          return (item.subcategoryName===filterKeySubcatagory)
        })
      }
    }
    console.log('filtered merchants: ', merchantsFiltered)
    this.setState({merchantsFiltered: merchantsFiltered})
  }

  handleFilterCategory = (event) => {
    console.log(event.target.value)
    this.setState({
      filterKeyCategory: event.target.value,
      filterKeySubcatagory: 'all'
    }, ()=>{
      console.log(this.state.filterKeyCategory)
      this.handleFilterChange()
    });
  }

  handleFilterSubcategory = (event) => {
    console.log(event.target.value)
    this.setState({
      filterKeySubcatagory: event.target.value
    }, ()=>{
      console.log(this.state.filterKeySubcatagory)
      this.handleFilterChange()
    });
  }

  filterSubcategory = () => {
    const { filterKeyCategory } = this.state;
    if (filterKeyCategory === 'all') {
      return 
    } else {
      const { jsonData } = this.state;
      const { categories } = jsonData;
      let subcategories = []
      for (var i = 0; i < categories.length; i++) {
        if (categories[i].name === filterKeyCategory) {
          subcategories = categories[i].subcategories
        }
      }
      if (subcategories.length > 0) {
        let subcategoryOptions = () => {
          let options = subcategories.map((subcategory, i) => {
            // console.log(subcategory, i)
            return (
              <div key={i}>
                <input 
                  type="radio" name="filterKeySubcategory" id={subcategory} 
                  value={subcategory} onChange={this.handleFilterSubcategory}
                />
                <label htmlFor={subcategory} className="ml-1">{subcategory}</label>
              </div>
            )
          })
          return options
        }
        return (
          <div className="filter">
            <label className="filter-name">ประเภท{filterKeyCategory}</label>
            <div>
              <input 
                type="radio" name="filterKeySubcategory" id="allsubcategories" 
                value="all" onChange={this.handleFilterSubcategory} defaultChecked
              />
              <label htmlFor="allsubcategories" className="ml-1">ทั้งหมด</label>
            </div>
            {subcategoryOptions()}
          </div>
        )
      }
    }
  }

  filterPriceRange = () => {
    const { jsonData } = this.state;
    let priceRangeOptions = () => {
      if (!!jsonData) {
        const { priceRange } = jsonData;
        let options = priceRange.map((range, i) => {
          return <option value={i} key={i}>{range}</option>
        })
        return options
      }
    }    
    return (
      <div className="filter">
        <label className="filter-name" htmlFor="filterPriceRange">ราคา</label>
        <select className="form-control" id="filterPriceRange" defaultValue="">
          <option value="" disabled>กรุณาเลือก</option>
          <option value="all">ทั้งหมด</option>
          {priceRangeOptions()}
        </select>
      </div>
    )
  }

  filterArea = () => {
    const { jsonData } = this.state;
    let provinceOptions = () => {
      if (!!jsonData) {
        const { provinces } = jsonData;
        let options = provinces.map((province, i) => {
          return <option value={province} key={i}>{province}</option>
        })
        return options
      }
    }    
    return (
      <div className="filter">
        <label className="filter-name" htmlFor="filterArea">จังหวัด/ใกล้ฉัน</label>
        <select className="form-control" id="filterArea">
          <option value="nearme" defaultValue>พื้นที่ใกล้ฉัน</option>
          <option value="all">พื้นที่ทั้งหมด</option>
          {provinceOptions()}
        </select>
      </div>
    )
  }

  merchants = () => {
    if (!!this.state.jsonData) {
      const { merchantsFiltered } = this.state;
      if (merchantsFiltered.length > 0) {
        let merchants = merchantsFiltered.map((merchant, i) => {
          return (
            <MerchantDetail
              detail={merchant}
              key={i}
            />
          )
        })
        return merchants
      } else {
        return (
          <div className="text-center mt-4">
            <span>ขออภัย ไม่พบร้านค้าที่คุณต้องการ</span>
          </div>
        )
      }
    } else {
      console.log('Loading Data...')
      return (
        <p>Loading...</p>
      )
    }

  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-light bg-light">
          <span className="navbar-brand mb-0 h1">คนละครึ่ง by YWC</span>
        </nav>
        <div className="container-fluid">
          <div className="row">
            <div className="filter-panel col-md-3">
              {this.filterCategory()}
              {this.filterPriceRange()}
              {this.filterArea()}
              {this.filterSubcategory()}
            </div>
            <div className="col-md-9">
              {this.merchants()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
