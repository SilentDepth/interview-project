function randomTime (): number {
  return Math.floor(Math.random() * 2000)
}

function pause (time: number = randomTime()) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

const SELECT_OPTIONS: SelectOption[] = [
  { value: '111', label: 'One' },
  { value: '222', label: 'Two' },
  { value: '333', label: 'Three' },
  { value: '444', label: 'Four' },
  { value: '555', label: 'Five' },
  { value: '666', label: 'Six' },
  { value: '777', label: 'Seven' },
  { value: '888', label: 'Eight' },
  { value: '999', label: 'Nine' },
  { value: '000', label: 'Ten' },
]

export async function fetchSelectOptions (keyword?: string): Promise<SelectOption[]> {
  await pause()
  if (keyword) {
    return SELECT_OPTIONS.filter(opt => opt.label.toLowerCase().includes(keyword.toLowerCase()))
  } else {
    return SELECT_OPTIONS
  }
}
