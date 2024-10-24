import './filterModal.css'

const FilterModal = ({ setOpenFilterModal }) => {
  return (
    <div className='filterModal-bg' onClick={() => setOpenFilterModal(false)}>
        <div className="filterModal-container" onClick={(e) => e.stopPropagation()}>
           
        
        </div>
    </div>
  )
}

export default FilterModal