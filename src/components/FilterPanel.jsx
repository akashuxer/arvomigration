import { useMemo, useState } from 'react'
import { ArvoButton, ArvoChip, ArvoIconButton, ArvoSearch } from '@arvo/react'

/* The filter, expanded — built to the Figma spec.
 *
 *   dimension  →  attribute column  →  member tiles
 *
 * Two rules from the file drive the whole layout:
 *
 *   "see 1st column - showing 5 tiles max"
 *   "2nd column also showing 5 - but 1st one is the parent name"
 *
 * So an attribute is a fixed five-row grid that fills column-major and pages
 * sideways, not a wrapping cloud of chips. That is what keeps four dimensions
 * on one screen at a predictable height: the panel's height is set by the
 * five-row grid and never by how many members an attribute happens to have.
 *
 * Dimensions sit side by side, divided by a rule, and the body scrolls
 * horizontally when there are more of them than fit.
 */

const ROWS = 5
const COLUMNS_PER_PAGE = 2
const PAGE_SIZE = ROWS * COLUMNS_PER_PAGE

export const DIMENSIONS = [
  {
    id: 'product',
    label: 'Product',
    attributes: [
      {
        id: 'category',
        label: 'Category',
        members: ['iPhone', 'iPad', 'MacBook', 'iMac', 'Apple Watch'],
      },
      {
        id: 'l3',
        label: 'L3',
        members: [
          'PL_180', 'PL_210', 'PL_220', 'PL_310', 'PL_330',
          'PL_340', 'PL_350', 'PL_360', 'PL_370', 'PL_380',
          'PL_410', 'PL_420', 'PL_430', 'PL_440', 'PL_450',
          'PL_510', 'PL_520', 'PL_530',
        ],
      },
      {
        id: 'item',
        label: 'Item',
        members: [
          'Aquafina PET 500', 'Module_1', 'Module_2', 'Module_3', 'Module_4',
          'PP_9000_1', 'P_18000_1', 'P_18000_10', 'P_18000_2', 'P_18000_3',
          'P_18000_4', 'P_18000_5', 'P_18000_6', 'P_18000_7', 'P_18000_8',
        ],
      },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    attributes: [
      {
        id: 'customer',
        label: 'Customer',
        members: [
          'Customer-A01', 'Customer-A02', 'Customer-A03', 'Customer-A04', 'Customer-A05',
          'Customer-A06', 'Customer-A07', 'Customer-A08', 'Customer-A09', 'Customer-A10',
          'Customer-A11', 'Customer-A12', 'Customer-A13', 'Customer-A14', 'Customer-A15',
        ],
      },
      {
        id: 'channel',
        label: 'Channel',
        members: ['Online', 'Retail', 'Wholesale', 'Direct'],
      },
    ],
  },
  {
    id: 'time',
    label: 'Time',
    attributes: [
      {
        id: 'year',
        label: 'Year',
        isSingle: true,
        members: ['FY-18', 'FY-19', 'FY-20', 'FY-21', 'FY-22', 'FY-23', 'FY-24', 'FY-25'],
      },
      {
        id: 'horizon',
        label: 'Horizon',
        isSingle: true,
        members: ['PlanningHorizon', 'Rolling 12M', 'CY'],
      },
    ],
  },
  {
    id: 'version',
    label: 'Version',
    attributes: [
      {
        id: 'version-name',
        label: 'Version Name',
        isSingle: true,
        members: [
          'CurrentWorkingView', 'Flex Scenario', 'NewVersion1', 'Custom TES', 'InfiniteNodeTest',
          'NewVersion2', 'DailyShelfLife', 'LGP', 'NewVersion3', 'Data Staging',
          'MLS', 'NewVersion4',
        ],
      },
    ],
  },
]

const ATTRIBUTES = DIMENSIONS.flatMap(({ attributes }) => attributes)
export const attributeById = (id) => ATTRIBUTES.find((attribute) => attribute.id === id)

export const INITIAL_SELECTION = {
  year: ['FY-18'],
  horizon: ['PlanningHorizon'],
  'version-name': ['CurrentWorkingView'],
  customer: ['Customer-A06'],
}

/* Big member counts are reported the way the design does it -- 10K, not 10,247.
 * The exact number of a list nobody will read to the end of is noise; the order
 * of magnitude is the part that tells you whether to search instead of scroll. */
const abbreviate = (count) => {
  if (count >= 1000) return `${Math.round(count / 100) / 10}K`.replace('.0K', 'K')
  return String(count)
}

export function activeChips(selection, excluded = {}) {
  const chips = []
  ATTRIBUTES.forEach(({ id, label, isSingle }) =>
    (selection[id] ?? []).forEach((member) =>
      chips.push({
        attributeId: id,
        attributeLabel: label,
        member,
        isSingle,
        isExcluded: (excluded[id] ?? []).includes(member),
      }),
    ),
  )
  return chips
}

function Attribute({ attribute, selected, excluded, onToggle, onMenu }) {
  const { id, label, members, isSingle } = attribute
  const [page, setPage] = useState(0)
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return needle ? members.filter((m) => m.toLowerCase().includes(needle)) : members
  }, [members, query])

  const pageCount = Math.max(1, Math.ceil(matches.length / PAGE_SIZE))
  const current = Math.min(page, pageCount - 1)
  const start = current * PAGE_SIZE
  const shown = matches.slice(start, start + PAGE_SIZE)
  const remaining = matches.length - (start + shown.length)

  /* The last cell becomes "More (+N)" when there is another page, exactly as
     the design shows it -- so the way forward is a tile in the grid, not only a
     chevron in the header someone has to go looking for. */
  const hasMore = remaining > 0
  const tiles = hasMore ? shown.slice(0, PAGE_SIZE - 1) : shown

  const go = (delta) => setPage(() => Math.min(Math.max(current + delta, 0), pageCount - 1))

  return (
    <div className="fattr">
      <div className="fattr__head">
        <span className="fattr__name">{label}</span>
        {/* Count, with a dot when this attribute is carrying a selection: the
            number says how big the list is, the dot says you have touched it. */}
        <span className={`fattr__count${selected.length ? ' is-dirty' : ''}`}>
          {abbreviate(members.length)}
        </span>

        <span className="fattr__tools">
          <ArvoIconButton
            icon="angle-left"
            tooltip="Previous members"
            variant="tertiary"
            size="xs"
            isDisabled={current === 0}
            onClick={() => go(-1)}
          />
          <ArvoIconButton
            icon="angle-right"
            tooltip="Next members"
            variant="tertiary"
            size="xs"
            isDisabled={current >= pageCount - 1}
            onClick={() => go(1)}
          />
          <ArvoIconButton
            icon="ellipsis-v"
            tooltip={`${label} options`}
            variant="tertiary"
            size="xs"
            onClick={(event) => onMenu(attribute, event.currentTarget ?? event.target)}
          />
          <ArvoIconButton
            icon="search"
            tooltip={`Search ${label}`}
            variant="tertiary"
            size="xs"
            isSelected={isSearching}
            onClick={() => {
              setIsSearching((open) => !open)
              if (isSearching) setQuery('')
              setPage(0)
            }}
          />
        </span>
      </div>

      {/* Search belongs to the attribute, not to the panel: "A06" means one
          thing under Customer and nothing under Year, and a single box across
          all of them would have to guess which you meant. */}
      {isSearching && (
        <div className="fattr__search">
          <ArvoSearch
            placeholder={label}
            isFullWidth
            value={query}
            onInput={(event) => {
              setQuery(event?.target?.value ?? '')
              setPage(0)
            }}
            onClear={() => setQuery('')}
          />
        </div>
      )}

      <div className="fattr__grid">
        {tiles.map((member) => {
          const isSelected = selected.includes(member)
          const isExcluded = excluded.includes(member)
          return (
            <button
              type="button"
              key={member}
              className={`ftile${isSelected ? ' is-selected' : ''}${
                isExcluded ? ' is-excluded' : ''
              }${isSingle ? ' ftile--single' : ''}`}
              aria-pressed={isSelected}
              title={member}
              onClick={() => onToggle(id, member, isSingle)}
            >
              <span className="ftile__label">{member}</span>
              {/* Excluded wins the slot: a member that is filtered *out* has to
                  say so louder than it says which radio group it belongs to. */}
              {isExcluded ? (
                <i className="o9con o9con-ban ftile__mark" aria-hidden="true" />
              ) : (
                isSingle && (
                  <i
                    className={`o9con ftile__mark ${
                      isSelected ? 'o9con-radio-checked' : 'o9con-circle-o'
                    }`}
                    aria-hidden="true"
                  />
                )
              )}
            </button>
          )
        })}

        {hasMore && (
          <button type="button" className="ftile ftile--more" onClick={() => go(1)}>
            More (+{remaining + 1})
          </button>
        )}

        {matches.length === 0 && <span className="fattr__empty">No matches</span>}
      </div>
    </div>
  )
}

export default function FilterPanel({
  selection,
  excluded,
  onToggle,
  onSelectAll,
  onClearAttribute,
  onToggleExclude,
  onClear,
  onReset,
  onApply,
}) {
  /* Which attribute's ⋮ is open. One menu for all of them, retargeted, for the
     same reason the pivot has one column-filter popover. */
  const [menu, setMenu] = useState(null)

  return (
    <div className="fpanel">
      <div className="fpanel__body">
        {DIMENSIONS.map(({ id, label, attributes }) => (
          <section className="fpanel__dim" key={id}>
            <h3 className="fpanel__dim-name">{label}</h3>
            <div className="fpanel__attrs">
              {attributes.map((attribute) => (
                <Attribute
                  key={attribute.id}
                  attribute={attribute}
                  selected={selection[attribute.id] ?? []}
                  excluded={excluded[attribute.id] ?? []}
                  onToggle={onToggle}
                  onMenu={(target) => setMenu(target.id === menu ? null : target.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {menu && (
        /* Deliberately plain: these are three verbs against one attribute, and
           a portalled overlay for three verbs costs more than it carries. */
        <div className="fpanel__menu-scrim" onClick={() => setMenu(null)}>
          <div className="fpanel__menu" onClick={(event) => event.stopPropagation()}>
            <span className="fpanel__menu-title">{attributeById(menu)?.label}</span>
            {!attributeById(menu)?.isSingle && (
              <button type="button" onClick={() => { onSelectAll(menu); setMenu(null) }}>
                Select all
              </button>
            )}
            <button type="button" onClick={() => { onClearAttribute(menu); setMenu(null) }}>
              Clear selection
            </button>
            {!attributeById(menu)?.isSingle && (
              /* Exclude rather than deselect: "everything but these four" is a
                 filter people actually want, and building it by selecting the
                 other nine hundred is not a thing anyone will do. */
              <button type="button" onClick={() => { onToggleExclude(menu); setMenu(null) }}>
                Exclude selected members
              </button>
            )}
          </div>
        </div>
      )}

      <div className="fpanel__footer">
        <ArvoButton label="Clear" variant="secondary" size="md" onClick={onClear} />
        <ArvoButton label="Reset" variant="secondary" size="md" onClick={onReset} />
        <ArvoButton label="Apply" variant="primary" size="md" onClick={onApply} />
      </div>
    </div>
  )
}

/* The Active row, paged.
 *
 * Ten selections is an ordinary afternoon and they cannot all sit in a 40px
 * bar, so the row shows a window of them with the remainder counted on either
 * side -- the design's "Previous +12 / Next +12". Truncating with an ellipsis
 * instead would hide how much is hidden, which is the one number that decides
 * whether you need to look. */
const CHIP_WINDOW = 6

export function ActiveChips({ selection, excluded, onRemove }) {
  const [offset, setOffset] = useState(0)
  const chips = activeChips(selection, excluded)

  const start = Math.min(offset, Math.max(0, chips.length - CHIP_WINDOW))
  const shown = chips.slice(start, start + CHIP_WINDOW)
  const before = start
  const after = chips.length - (start + shown.length)

  if (chips.length === 0) {
    return <span className="fpanel__active-empty">No filters selected</span>
  }

  return (
    <div className="fpanel__active">
      <span className="fpanel__active-label">Active:</span>

      {before > 0 && (
        <button
          type="button"
          className="fpanel__page"
          onClick={() => setOffset(Math.max(0, start - CHIP_WINDOW))}
        >
          Previous +{before}
        </button>
      )}

      {/* Arvo's own chip, and the member on its own.
       *
       * The attribute name was repeated on every chip, which spent a third of a
       * crowded row restating a word the panel below already has as a heading --
       * and the members are distinctive enough to place themselves. isExcluded
       * and onDismiss are the component's own states, so the exclusion mark and
       * the remove button come from the design system rather than from CSS
       * here. */}
      {shown.map(({ attributeId, attributeLabel, member, isSingle, isExcluded }) => (
        <ArvoChip
          key={`${attributeId}::${member}`}
          variant="input"
          size="sm"
          label={member}
          tooltip={attributeLabel}
          isExcluded={isExcluded}
          /* No dismiss on a single-select chip: emptying it would leave the
             attribute with nothing, which is not a state it has. It changes by
             picking another member. */
          {...(isSingle
            ? null
            : {
                dismissLabel: `Remove ${member}`,
                onDismiss: () => onRemove(attributeId, member),
              })}
        />
      ))}

      {after > 0 && (
        <button
          type="button"
          className="fpanel__page"
          onClick={() => setOffset(start + CHIP_WINDOW)}
        >
          Next +{after}
        </button>
      )}
    </div>
  )
}
