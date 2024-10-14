import { DeleteIcon, Search } from 'lucide-react'
import PropsTypes from 'prop-types'
import Button from './Button'
import { toNumber } from '../utils/common'
import StockCard from './StockCard'

const Result = ({ stockDetails, search, setSearch, shortBy, setShortBy }) => {
  return (
    <div className="pt-20 container mx-auto flex flex-col h-screen p-2">
      <div className="py-2 rounded-md flex-col gap-y-2 sm:gap-y-0 sm:flex-row flex justify-between items-center px-3">
        <div className="flex bg-white w-full sm:w-fit py-2 border-[0.5px] rounded-md items-center gap-2 px-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            className="px-2 outline-none w-full"
            placeholder="Search..."
            value={search}
            onChange={(ev) => setSearch(ev.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full sm:w-fit  items-center justify-between sm:justify-normal ">
          <select
            onChange={(e) => setShortBy(e.currentTarget.value)}
            className="bg-slate-200 p-2 rounded-md"
            value={shortBy}
          >
            <option value={'none'}>Sort by</option>
            <option value={'rating'}>Rating</option>
            <option value={'market_cap'}>Market Value</option>
            <option value={'quantity'}>Quantity</option>
            <option value={'percentage_of_aum'}>Percentage of AUM</option>
          </select>
          <Button
            onClick={() => {
              setShortBy('none')
              setSearch('')
            }}
            title={'Reset'}
            icon={<DeleteIcon width={24} height={24} />}
          />
        </div>
      </div>
      <div className="gap-3 mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 flex-grow overflow-auto">
        {stockDetails
          .filter((item) => {
            if (!search) {
              return true
            } else {
              let isValid = false

              Object.values(item).forEach((value) => {
                if (
                  value &&
                  value.toString().toLowerCase().includes(search.toLowerCase())
                ) {
                  isValid = true
                }
              })

              return isValid
            }
          })
          .sort((a, b) => {
            if (shortBy === 'rating') {
              return toNumber(a.stockRate) - toNumber(b.stockRate)
            } else if (shortBy === 'market_cap') {
              return (
                toNumber(a['Market/Fair Value']) -
                toNumber(b['Market/Fair Value'])
              )
            } else if (shortBy === 'quantity') {
              return toNumber(a.Quantity) - toNumber(b.Quantity)
            } else if (shortBy === 'percentage_of_aum') {
              return (
                toNumber(a['Percentage of AUM']) -
                toNumber(b['Percentage of AUM'])
              )
            } else {
              return 0
            }
          })
          // Filter stocks by unique ISIN
          .filter((stock, index, self) => {
            return index === self.findIndex((s) => s.ISIN === stock.ISIN)
          })
          .map((stockData) => (
            <StockCard key={stockData.ISIN} stockData={stockData} />
          ))}
      </div>
    </div>
  )
}

Result.propTypes = {
  stockDetails: PropsTypes.array,
  search: PropsTypes.string,
  setSearch: PropsTypes.func,
  shortBy: PropsTypes.string,
  setShortBy: PropsTypes.func,
}

export default Result
