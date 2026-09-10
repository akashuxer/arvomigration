import { forwardRef, useImperativeHandle, useState } from 'react'
import { ArvoCheckbox, ArvoCombobox, ArvoIconButton, ArvoMultiSelect } from '@arvo/react'

/* Download.
 *
 * The same two-part shape as Bulk Edit: one thing you choose, and a set of
 * fields reporting what the pivot is already showing. Download As is the only
 * decision here -- everything below it describes the view being exported, which
 * is settled before the dialog opens and is changed through the picker behind
 * the + rather than typed over.
 *
 * Format is a combobox taking one value: a file is one format, and a field that
 * accepted several would raise the question of whether it means three files or
 * one impossible one.
 */

const FORMATS = [
  { id: 'excel', value: 'excel', label: 'EXCEL' },
  { id: 'csv', value: 'csv', label: 'CSV' },
  { id: 'pdf', value: 'pdf', label: 'PDF' },
  { id: 'tsv', value: 'tsv', label: 'TSV' },
]

/* What the export covers. Populated from the current view, which is why these
 * arrive filled and read-only. L1 carries far more members than fit, so the
 * field's own overflow chip does the counting. */
const SCOPE = [
  {
    id: 'l1',
    label: 'L1',
    values: [
      'Commodity_150',
      'Commodity_151',
      'Dummy',
      'InventoryDemand',
      'PG_1000',
      'PG_2000',
      'PG_3000',
      'PG_4000',
      'PG_4500',
      'PG_5000',
    ],
    isRequired: false,
  },
  { id: 'version', label: 'Version Name', values: ['CurrentWorkingView'], isRequired: true },
  { id: 'measures', label: 'Measures', values: ['List Price'], isRequired: false },
]

const DownloadForm = forwardRef(function DownloadForm({ onPickScope }, ref) {
  const [format, setFormat] = useState('excel')
  const [isUtc, setIsUtc] = useState(true)

  useImperativeHandle(ref, () => ({
    collect: () => ({ format, isUtc, scope: SCOPE }),
    /* The format is what a download cannot do without, so it is what Download
       checks before running. */
    isReady: () => Boolean(format),
  }))

  return (
    <div className="bulk">
      <div className="bulk__field">
        <span className="bulk__field-label">
          Download as <span className="bulk__required">*</span>
        </span>
        <div className="bulk__field-row">
          <ArvoCombobox
            aria-label="Download as"
            placeholder="Select a format"
            items={FORMATS}
            /* null rather than '': an empty string is a value this build tries
               to resolve against the items and answers by selecting the first,
               which would make the field look chosen when it was not. */
            value={format || null}
            isClearable={false}
            isFullWidth
            onChange={(value) => setFormat(typeof value === 'string' ? value : value?.value)}
          />
        </div>
      </div>

      {/* Everything below is the view being exported, not a decision. */}
      <div className="bulk__scope">
        {SCOPE.map(({ id, label, values, isRequired }) => (
          <div className="bulk__field" key={id}>
            <span className="bulk__field-label">
              {label} {isRequired && <span className="bulk__required">*</span>}
            </span>
            <div className="bulk__field-row">
              <ArvoMultiSelect
                aria-label={label}
                isReadOnly
                isClearable={false}
                isFullWidth
                items={values.map((value) => ({ id: value, value, label: value }))}
                value={values}
              />
              <ArvoIconButton
                icon="plus"
                tooltip={`Choose ${label}`}
                variant="tertiary"
                size="sm"
                onClick={() => onPickScope(label)}
              />
            </div>
          </div>
        ))}

        {/* A single checkbox with its own heading in the original. The label is
            the question, so it does not need one above it as well. */}
        <ArvoCheckbox
          label="Download in UTC"
          hasDescription
          description="Timestamps are written in UTC rather than your local time."
          isChecked={isUtc}
          onChange={(event) => setIsUtc(event?.target?.checked ?? !isUtc)}
        />
      </div>
    </div>
  )
})

export default DownloadForm
