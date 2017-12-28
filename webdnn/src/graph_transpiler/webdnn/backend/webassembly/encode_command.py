from webdnn.backend.code_generator.command_buffer import CommandBuffer


def encode_command(builder: CommandBuffer):
    generated_lines = []
    indent_level = 1
    indent_text = "    "

    for code in builder.codes:
        if code[0] == "declare":
            # (declare, typename, varname, initial_val, const)
            typename, varname, initial_val, const = code[1:]
            if const:
                typename = "const " + typename

            if initial_val is None:
                generated_lines.append(f"{indent_text}{typename} {varname};")

            else:
                generated_lines.append(f"{indent_text}{typename} {varname} = {initial_val};")

        elif code[0] == "load":
            #  (load, typename, varname, buffer_key, const)
            typename, varname, buffer_key, const = code[1:]
            if typename is None:
                generated_lines.append(f"{indent_text}{varname} = %%LOAD_BUFFER({buffer_key})%%;")

            elif typename == "float":
                generated_lines.append(f"{indent_text}{typename} {varname} = *((float *)(&%%LOAD_BUFFER({buffer_key})%%));")

            else:
                if const:
                    typename = "const " + typename

                generated_lines.append(f"{indent_text}{typename} {varname} = %%LOAD_BUFFER({buffer_key})%%;")

        elif code[0] == "exec":
            #  (Exec, expression)
            expression, = code[1:]
            generated_lines.append(f"{indent_text}{expression}")

        elif code[0] == "enterFor":
            #  (EnterFor, counter, initial_val, max_val, step_value)
            counter, initial_val, max_val, step_value = code[1:]
            generated_lines.append(f"{indent_text}for ({counter} = {initial_val}; {counter} < {max_val}; {counter} += {step_value}) {{")
            indent_level += 1
            indent_text = "    " * indent_level

        elif code[0] == "exitFor":
            #  (ExitFor,)
            indent_level -= 1
            indent_text = "    " * indent_level
            generated_lines.append(f"{indent_text}}}")

        elif code[0] == "enterBlockScope":
            #  (EnterBlockScope,)
            generated_lines.append(f"{indent_text}{{")
            indent_level += 1
            indent_text = "    " * indent_level

        elif code[0] == "exitBlockScope":
            #  (ExitBlockScope,)
            indent_level -= 1
            indent_text = "    " * indent_level
            generated_lines.append(f"{indent_text}}}")

        elif code[0] == "comment":
            #  (comment, text)
            text, = code[1:]
            generated_lines.append(f"{indent_text}//{text}}}")

        else:
            raise NotImplementedError(f"Unknown OP code: {code}")

    generated_lines = "\n".join(generated_lines)

    return f"""
void %%FUNC_NAME%%(const int * %%META_BUFFER%%)
{{
{generated_lines}
}}
""" \
        .replace("%%INITIAL_PARALLEL_POSITION%%", "0") \
        .replace("%%PARALLEL_SIZE%%", "1")
