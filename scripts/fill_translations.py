#!/usr/bin/env python3
"""Fill empty FR/ES translations using translation maps"""

import re, sys
sys.path.insert(0, '.')
from scripts.translation_maps import FR_MAP, ES_MAP

def parse_args(args_str):
    """Parse comma-separated E() arguments, respecting quotes"""
    args = []
    current = ''
    in_quote = False
    quote_char = None
    for c in args_str:
        if c in "'\"" and (not in_quote or c == quote_char):
            if not in_quote:
                in_quote = True
                quote_char = c
            else:
                in_quote = False
                quote_char = None
            current += c
        elif c == ',' and not in_quote:
            args.append(current.strip().strip("'\""))
            current = ''
        else:
            current += c
    args.append(current.strip().strip("'\""))
    return args

def fmt_args(args):
    """Format arguments back into E() call"""
    quoted = []
    for a in args:
        # Escape single quotes
        a = a.replace("\\", "\\\\").replace("'", "\\'")
        quoted.append(f"'{a}'" if "'" not in a[1:-1] else f'"{a}"')
    return ', '.join(quoted)

with open('src/i18n/translations.ts') as f:
    text = f.read()

pattern = r'(\w+):\s*E\(([^)]*(?:\([^)]*\)[^)]*)*)\)'
filled = 0
unfilled_fr = 0
unfilled_es = 0

def replace_match(m):
    global filled, unfilled_fr, unfilled_es
    key = m.group(1)
    args = parse_args(m.group(2))
    en = args[0] if args else ''
    fr = args[1] if len(args) > 1 else ''
    es = args[2] if len(args) > 2 else ''
    zh = args[3] if len(args) > 3 else ''
    
    changed = False
    if (not fr or fr == '') and en in FR_MAP:
        fr = FR_MAP[en]
        changed = True
    if (not es or es == '') and en in ES_MAP:
        es = ES_MAP[en]
        changed = True
    
    if changed:
        filled += 1
    
    if not fr or fr == '':
        unfilled_fr += 1
    if not es or es == '':
        unfilled_es += 1
    
    new_args = [en, fr, es, zh]
    return f"{key}: E({fmt_args(new_args)})"

result = re.sub(pattern, replace_match, text)

with open('src/i18n/translations.ts', 'w') as f:
    f.write(result)

print(f"✅ Filled: {filled} keys")
print(f"⚠️  Still empty FR: {unfilled_fr}")
print(f"⚠️  Still empty ES: {unfilled_es}")
