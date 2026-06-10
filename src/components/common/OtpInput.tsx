import {

  ClipboardEvent,

  KeyboardEvent,

  useEffect,

  useRef,

  useState,

} from 'react';



const OTP_LENGTH = 6;



interface OtpInputProps {

  value: string;

  onChange: (value: string) => void;

  disabled?: boolean;

  hasError?: boolean;

}



function OtpInput({ value, onChange, disabled = false, hasError = false }: OtpInputProps) {

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const [focusedIndex, setFocusedIndex] = useState(0);

  const isComplete = value.length === OTP_LENGTH;



  const digits = Array.from({ length: OTP_LENGTH }, (_, index) => value[index] ?? '');



  useEffect(() => {

    if (!disabled) {

      inputsRef.current[0]?.focus();

    }

  }, [disabled]);



  const updateValue = (nextDigits: string[]) => {

    onChange(nextDigits.join('').slice(0, OTP_LENGTH));

  };



  const handleChange = (index: number, digit: string) => {

    const sanitized = digit.replace(/\D/g, '').slice(-1);

    const nextDigits = [...digits];

    nextDigits[index] = sanitized;

    updateValue(nextDigits);



    if (sanitized && index < OTP_LENGTH - 1) {

      inputsRef.current[index + 1]?.focus();

    }

  };



  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {

    if (event.key === 'Backspace' && !digits[index] && index > 0) {

      inputsRef.current[index - 1]?.focus();

    }

  };



  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {

    event.preventDefault();

    const pasted = event.clipboardData

      .getData('text')

      .replace(/\D/g, '')

      .slice(0, OTP_LENGTH);

    if (!pasted) {

      return;

    }

    updateValue(pasted.split(''));

    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);

    inputsRef.current[focusIndex]?.focus();

  };



  return (

    <div className="otp-input" role="group" aria-label="Verification code">

      {digits.map((digit, index) => (

        <input

          key={index}

          ref={element => {

            inputsRef.current[index] = element;

          }}

          type="text"

          inputMode="numeric"

          autoComplete={index === 0 ? 'one-time-code' : 'off'}

          maxLength={1}

          value={digit}

          disabled={disabled}

          className={`otp-input-box${hasError ? ' otp-input-box--error' : ''}${

            isComplete || focusedIndex === index ? ' otp-input-box--focused' : ''

          }${isComplete ? ' otp-input-box--complete' : ''}`}

          onFocus={() => setFocusedIndex(index)}

          onChange={event => handleChange(index, event.target.value)}

          onKeyDown={event => handleKeyDown(index, event)}

          onPaste={handlePaste}

          aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}

        />

      ))}

    </div>

  );

}



export default OtpInput;


