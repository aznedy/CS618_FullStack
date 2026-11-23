import PropTypes from 'prop-types'

let nextRowKey = 0

// The form edits a row at a time.
// Row tracking in the form is done for React support.
export function emptyIngredientRow() {
  return { key: nextRowKey++, name: '', amount: '', unit: '' }
}

// Database shape -> form rows
export function toIngredientRows(ingredients = []) {
  return ingredients.map((ingredient) => ({
    key: nextRowKey++,
    name: ingredient.name ?? '',
    amount: ingredient.quantity?.amount?.toString() ?? '',
    unit: ingredient.unit ?? '',
  }))
}

// Form rows -> database shape. Blank rows are dropped.
export function toIngredients(rows) {
  return rows
    .filter((row) => row.name.trim() !== '')
    .map((row) => ({
      name: row.name.trim(),
      quantity: { amount: row.amount === '' ? undefined : Number(row.amount) },
      unit: row.unit.trim() === '' ? null : row.unit.trim(),
    }))
}

export function IngredientEditor({ idPrefix, rows, onChange }) {
  const updateRow = (key, field, value) =>
    onChange(
      rows.map((row) => (row.key === key ? { ...row, [field]: value } : row)),
    )
  const removeRow = (key) => onChange(rows.filter((row) => row.key !== key))
  const addRow = () => onChange([...rows, emptyIngredientRow()])

  return (
    <fieldset>
      <legend>Ingredients</legend>
      {rows.map((row, index) => (
        <div className='ingredient-row' key={row.key}>
          <label htmlFor={`${idPrefix}-ingredient-${row.key}-name`}>
            Ingredient {index + 1}
            <input
              type='text'
              id={`${idPrefix}-ingredient-${row.key}-name`}
              value={row.name}
              onChange={(e) => updateRow(row.key, 'name', e.target.value)}
            />
          </label>
          <label htmlFor={`${idPrefix}-ingredient-${row.key}-amount`}>
            Amount
            <input
              type='number'
              min='0'
              step='any'
              id={`${idPrefix}-ingredient-${row.key}-amount`}
              value={row.amount}
              onChange={(e) => updateRow(row.key, 'amount', e.target.value)}
            />
          </label>
          <label htmlFor={`${idPrefix}-ingredient-${row.key}-unit`}>
            Unit
            <input
              type='text'
              id={`${idPrefix}-ingredient-${row.key}-unit`}
              value={row.unit}
              onChange={(e) => updateRow(row.key, 'unit', e.target.value)}
            />
          </label>
          <button
            type='button'
            className='button-secondary'
            onClick={() => removeRow(row.key)}
          >
            Remove
          </button>
        </div>
      ))}
      <button type='button' className='button-secondary' onClick={addRow}>
        Add ingredient
      </button>
    </fieldset>
  )
}

IngredientEditor.propTypes = {
  idPrefix: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      amount: PropTypes.string.isRequired,
      unit: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
}
