
import json
import click
import sys

sys.path.append(".")

@click.command()
@click.option("--output-file", default="./error_codes", help="Output file for error codes.")
@click.option("--output-format", default="json", help="Output format for error codes.")
@click.option("--dict-mode", is_flag=True, help="Output error codes as a dictionary rather than a list.")
@click.option("--styling", default="default", help="Styling for error code vars")
def convert_error_codes_to_json_file(output_file, output_format, dict_mode, styling):
    from dojo.shared.error_codes.return_all_error_codes import error_codes
    
    output_file = output_file + "." + output_format
    if output_format == "json":
        if dict_mode:
            _generated_json = {}
            for error_code in error_codes:
                
                _generated_json[error_code().error_code] = {**json.loads(error_code().json())}
        else:
            _generated_json = [{'var': x.__name__, **json.loads(x().json())} for x in error_codes]
        
        if styling == "camel_case":                
            try:
                from inflection import camelize
                for error_code in _generated_json:
                    error_code['var'] = camelize(error_code['var'], uppercase_first_letter=False) 
            except:
                print("Unable to import inflection.  Please install it to use automatically convert styling!")
        
                
        json.dump(_generated_json, open(output_file, "w"), indent=4)
    elif output_format == "txt":
        
        with open(output_file, "w+") as file:
            file.write("*/ Automatically Generated */\n")
            for error_code in error_codes:
                file.write(f"{error_code.__name__}: {error_code().error_message} ({error_code().error_code})\n")
                file.write("\n")

    
if __name__ == '__main__':
    convert_error_codes_to_json_file()