#!/usr/bin/env python3
"""Fill ALL empty FR/ES translations"""
import re, sys

with open('src/i18n/translations.ts') as f:
    text = f.read()

FR = {
    "EN/FR/ZH Trilingual": "Trilingue EN/FR/ZH",
    "Sedans, SUVs, MPVs, sports cars \u2014 all major brands and models available for export": "Berlines, SUV, monospaces, voitures de sport \u2014 toutes les grandes marques et mod\u00e8les disponibles \u00e0 l'export",
    "BYD, NIO, Xpeng, Li Auto, Tesla China \u2014 full coverage of EV and hybrid vehicles": "BYD, NIO, Xpeng, Li Auto, Tesla Chine \u2014 couverture compl\u00e8te des v\u00e9hicules \u00e9lectriques et hybrides",
    "Submit Your Requirements": "Soumettez vos besoins",
    "Tell us the vehicle type, brand, budget, and destination country you need": "Indiquez le type de v\u00e9hicule, la marque, le budget et le pays de destination souhait\u00e9",
    "Supplier Matching": "Recherche de fournisseurs",
    "We connect with verified suppliers to find vehicles matching your requirements": "Nous contactons des fournisseurs v\u00e9rifi\u00e9s pour trouver des v\u00e9hicules correspondant \u00e0 vos besoins",
    "Inspection & Quotation": "Inspection et devis",
    "On-site vehicle inspection with real photos/videos, confirmed pricing": "Inspection sur site avec photos/vid\u00e9os r\u00e9elles, prix confirm\u00e9",
    "Contract & Documentation": "Contrat et documentation",
    "Confirm pricing, export documents, shipping plan, and sign purchase agreement": "Confirmation du prix, documents d'exportation, plan d'exp\u00e9dition et signature du contrat d'achat",
    "Payment & Logistics": "Paiement et logistique",
    "Coordinate payment settlement, export customs, international shipping, and destination delivery": "Coordination du r\u00e8glement, d\u00e9douanement export, exp\u00e9dition internationale et livraison \u00e0 destination",
    "Verified Vehicles": "V\u00e9hicules v\u00e9rifi\u00e9s",
    "Browse Vehicle Listings": "Parcourir les annonces",
    "Verified Vehicles Coming Soon": "V\u00e9hicules v\u00e9rifi\u00e9s bient\u00f4t disponibles",
    "No verified vehicles are currently available. Listings will appear here after photo masking, on-site inspection, and supplier confirmation.": "Aucun v\u00e9hicule v\u00e9rifi\u00e9 n'est actuellement disponible. Les annonces appara\u00eetront ici apr\u00e8s masquage des photos, inspection sur site et confirmation du fournisseur.",
    "Can't find what you need? Submit an inquiry": "Vous ne trouvez pas? Soumettez une demande",
    "Price Indication": "Indication de prix",
    "View Details": "Voir les d\u00e9tails",
    "All Brands": "Toutes les marques",
    "All Types": "Tous les types",
    "All Years": "Toutes les ann\u00e9es",
    "All Fuel Types": "Tous les carburants",
    "Fill in the details below and we will contact you within 24 hours": "Remplissez les d\u00e9tails ci-dessous et nous vous contacterons sous 24 heures",
    "Inquiry Submitted!": "Demande envoy\u00e9e!",
    "Thank you for your inquiry. We will contact you within 24 hours.": "Merci pour votre demande. Nous vous contacterons sous 24 heures.",
    "Submit another inquiry": "Soumettre une autre demande",
    "Selected Vehicle": "V\u00e9hicule s\u00e9lectionn\u00e9",
    "Enter your full name": "Entrez votre nom complet",
    "Country / Region": "Pays / R\u00e9gion",
    "Enter your country or region": "Entrez votre pays ou r\u00e9gion",
    "Enter your email address": "Entrez votre adresse email",
    "Enter your phone number": "Entrez votre num\u00e9ro de t\u00e9l\u00e9phone",
    "Enter your WhatsApp number": "Entrez votre num\u00e9ro WhatsApp",
    "Enter your Telegram username": "Entrez votre identifiant Telegram",
    "Describe your specific requirements (model, year, budget, etc.": "D\u00e9crivez vos besoins sp\u00e9cifiques (mod\u00e8le, ann\u00e9e, budget, etc.",
    "Under $5,000": "Moins de 5 000 $",
    "$5,000 - $10,000": "5 000 $ - 10 000 $",
    "$10,000 - $20,000": "10 000 $ - 20 000 $",
    "$20,000 - $50,000": "20 000 $ - 50 000 $",
    "$50,000 - $100,000": "50 000 $ - 100 000 $",
    "Above $100,000": "Plus de 100 000 $",
    "Not sure yet": "Pas encore s\u00fbr",
    "About Us": "\u00c0 propos",
    "Explore China Car Export Resources": "Explorez les ressources d'exportation automobile de Chine",
    "Market Guides": "Guides de march\u00e9",
    "Vehicle Categories": "Cat\u00e9gories de v\u00e9hicules",
    "EV & Brand Sourcing": "Approvisionnement VE et marques",
    "Commercial & Heavy Vehicles": "V\u00e9hicules utilitaires et lourds",
    "Core Pages": "Pages principales",
    "Procurement Services": "Services d'approvisionnement",
    "China-Wide Sourcing": "Approvisionnement dans toute la Chine",
    "Financial Support": "Soutien financier",
    "Consultation Hotline": "Ligne de consultation",
    "Join Us": "Rejoignez-nous",
    "About Honglajiao Auto Export": "\u00c0 propos de Honglajiao Auto Export",
    "Full-service China car export \u2014 sourcing, inspection, documentation, customs, and shipping.": "Service complet d'exportation automobile de Chine \u2014 approvisionnement, inspection, documentation, douane et exp\u00e9dition.",
    "Hi, I am interested in sourcing vehicles from China.": "Bonjour, je suis int\u00e9ress\u00e9 par l'approvisionnement de v\u00e9hicules de Chine.",
    "Construction Machinery & Heavy Equipment": "Engins de chantier et \u00e9quipement lourd",
    "Excavators, loaders, bulldozers, cranes and more \u2014 sourced from China": "Excavatrices, chargeuses, bulldozers, grues et plus \u2014 approvisionn\u00e9s de Chine",
    "No machinery currently available. Submit an inquiry with your requirements.": "Aucun engin disponible actuellement. Soumettez une demande avec vos besoins.",
    "Wheel Loader": "Chargeuse sur pneus",
    "Road Roller": "Rouleau compresseur",
    "Dump Truck": "Camion-benne",
    "Concrete Mixer": "B\u00e9tonni\u00e8re",
    "Tractor": "Tracteur",
    "Other Equipment": "Autre \u00e9quipement",
    "Browse Machinery": "Parcourir les engins",
    "Why Source from China": "Pourquoi s'approvisionner en Chine",
    "China is the world's largest automotive market with competitive pricing, vast inventory, and mature export infrastructure.": "La Chine est le plus grand march\u00e9 automobile mondial avec des prix comp\u00e9titifs, un vaste inventaire et une infrastructure d'exportation mature.",
    "Import Process": "Processus d'importation",
    "Customs Duties & Taxes": "Droits de douane et taxes",
    "Get a Quote for": "Obtenez un devis pour",
    "Contact us for a personalized quote": "Contactez-nous pour un devis personnalis\u00e9",
    "Duty Rate (CIF": "Taux de droit (CIF",
    "Related Guides": "Guides connexes",
    "Submit Requirements": "Soumettre les besoins",
    "Tell us your vehicle type, budget and destination": "Indiquez votre type de v\u00e9hicule, budget et destination",
    "We find verified suppliers matching your needs": "Nous trouvons des fournisseurs v\u00e9rifi\u00e9s correspondant \u00e0 vos besoins",
    "Inspection & Shipping": "Inspection et exp\u00e9dition",
    "On-site inspection, documentation, customs, and delivery": "Inspection sur site, documentation, douane et livraison",
    "No results found": "Aucun r\u00e9sultat trouv\u00e9",
    "Privacy Policy": "Politique de confidentialit\u00e9",
    "Terms of Service": "Conditions d'utilisation",
    "verified vehicles ready for export \u2014 bare car price shown, export costs not included": "v\u00e9hicules v\u00e9rifi\u00e9s pr\u00eats \u00e0 l'export \u2014 prix nu affich\u00e9, frais d'export non inclus",
    "Base Price": "Prix de base",
    "Ex-Works China": "D\u00e9part usine Chine",
    "+ export costs": "+ frais d'export",
    "No vehicles currently available. Check back soon.": "Aucun v\u00e9hicule disponible actuellement. Revenez bient\u00f4t.",
    "Don't see what you need?": "Vous ne trouvez pas votre bonheur?",
    "Submit Custom Inquiry": "Demande personnalis\u00e9e",
    "Vehicle Condition": "\u00c9tat du v\u00e9hicule",
    "Inquire About This Vehicle": "Demander pour ce v\u00e9hicule",
    "Drive Side": "C\u00f4t\u00e9 conduite",
    "Exterior": "Ext\u00e9rieur",
    "Interior": "Int\u00e9rieur",
    "VIN (last 6": "VIN (6 derniers",
    "Admin Access": "Acc\u00e8s administrateur",
    "Enter password to view inquiries": "Entrez le mot de passe pour voir les demandes",
    "Unlock": "D\u00e9verrouiller",
    "Wrong password": "Mot de passe incorrect",
    "\u2190 Back to site": "\u2190 Retour au site",
    "\U0001f4cb Inquiry Dashboard": "\U0001f4cb Tableau de bord des demandes",
    "submissions": "soumissions",
    "\U0001f504 Refresh": "\U0001f504 Actualiser",
    "Loading...": "Chargement...",
    "No inquiries yet.": "Aucune demande pour le moment.",
    "Select an inquiry to view": "S\u00e9lectionnez une demande \u00e0 afficher",
    "Chat": "Chat",
    "Form": "Formulaire",
    "Chat Widget": "Widget de chat",
    "Inquiry Form": "Formulaire de demande",
    "Language": "Langue",
    "Date": "Date",
    "Time": "Heure",
    "Quick Actions": "Actions rapides",
    "WhatsApp": "WhatsApp",
    "Copy": "Copier",
}

ES = {
    "EN/FR/ZH Trilingual": "Triling\u00fce EN/FR/ZH",
    "Sedans, SUVs, MPVs, sports cars \u2014 all major brands and models available for export": "Berlina, SUV, monovolumen, deportivos \u2014 todas las marcas y modelos principales disponibles para exportaci\u00f3n",
    "BYD, NIO, Xpeng, Li Auto, Tesla China \u2014 full coverage of EV and hybrid vehicles": "BYD, NIO, Xpeng, Li Auto, Tesla China \u2014 cobertura completa de veh\u00edculos el\u00e9ctricos e h\u00edbridos",
    "Submit Your Requirements": "Env\u00ede sus requisitos",
    "Tell us the vehicle type, brand, budget, and destination country you need": "Ind\u00edquenos el tipo de veh\u00edculo, marca, presupuesto y pa\u00eds de destino que necesita",
    "Supplier Matching": "B\u00fasqueda de proveedores",
    "We connect with verified suppliers to find vehicles matching your requirements": "Conectamos con proveedores verificados para encontrar veh\u00edculos que coincidan con sus requisitos",
    "Inspection & Quotation": "Inspecci\u00f3n y cotizaci\u00f3n",
    "On-site vehicle inspection with real photos/videos, confirmed pricing": "Inspecci\u00f3n en sitio con fotos/videos reales, precio confirmado",
    "Contract & Documentation": "Contrato y documentaci\u00f3n",
    "Confirm pricing, export documents, shipping plan, and sign purchase agreement": "Confirmar precio, documentos de exportaci\u00f3n, plan de env\u00edo y firmar acuerdo de compra",
    "Payment & Logistics": "Pago y log\u00edstica",
    "Coordinate payment settlement, export customs, international shipping, and destination delivery": "Coordinar liquidaci\u00f3n de pago, aduana de exportaci\u00f3n, env\u00edo internacional y entrega en destino",
    "Verified Vehicles": "Veh\u00edculos verificados",
    "Browse Vehicle Listings": "Explorar anuncios de veh\u00edculos",
    "Verified Vehicles Coming Soon": "Veh\u00edculos verificados pr\u00f3ximamente",
    "No verified vehicles are currently available. Listings will appear here after photo masking, on-site inspection, and supplier confirmation.": "No hay veh\u00edculos verificados disponibles actualmente. Los anuncios aparecer\u00e1n aqu\u00ed despu\u00e9s del enmascaramiento de fotos, inspecci\u00f3n en sitio y confirmaci\u00f3n del proveedor.",
    "Can't find what you need? Submit an inquiry": "\u00bfNo encuentra lo que busca? Env\u00ede una consulta",
    "Price Indication": "Indicaci\u00f3n de precio",
    "View Details": "Ver detalles",
    "All Brands": "Todas las marcas",
    "All Types": "Todos los tipos",
    "All Years": "Todos los a\u00f1os",
    "All Fuel Types": "Todos los combustibles",
    "Fill in the details below and we will contact you within 24 hours": "Complete los detalles a continuaci\u00f3n y lo contactaremos en 24 horas",
    "Inquiry Submitted!": "\u00a1Consulta enviada!",
    "Thank you for your inquiry. We will contact you within 24 hours.": "Gracias por su consulta. Lo contactaremos en 24 horas.",
    "Submit another inquiry": "Enviar otra consulta",
    "Selected Vehicle": "Veh\u00edculo seleccionado",
    "Enter your full name": "Ingrese su nombre completo",
    "Country / Region": "Pa\u00eds / Regi\u00f3n",
    "Enter your country or region": "Ingrese su pa\u00eds o regi\u00f3n",
    "Enter your email address": "Ingrese su direcci\u00f3n de email",
    "Enter your phone number": "Ingrese su n\u00famero de tel\u00e9fono",
    "Enter your WhatsApp number": "Ingrese su n\u00famero de WhatsApp",
    "Enter your Telegram username": "Ingrese su usuario de Telegram",
    "Describe your specific requirements (model, year, budget, etc.": "Describa sus requisitos espec\u00edficos (modelo, a\u00f1o, presupuesto, etc.",
    "Under $5,000": "Menos de $5,000",
    "$5,000 - $10,000": "$5,000 - $10,000",
    "$10,000 - $20,000": "$10,000 - $20,000",
    "$20,000 - $50,000": "$20,000 - $50,000",
    "$50,000 - $100,000": "$50,000 - $100,000",
    "Above $100,000": "M\u00e1s de $100,000",
    "Not sure yet": "A\u00fan no estoy seguro",
    "About Us": "Sobre nosotros",
    "Explore China Car Export Resources": "Explore recursos de exportaci\u00f3n de autos de China",
    "Market Guides": "Gu\u00edas de mercado",
    "Vehicle Categories": "Categor\u00edas de veh\u00edculos",
    "EV & Brand Sourcing": "Abastecimiento de VE y marcas",
    "Commercial & Heavy Vehicles": "Veh\u00edculos comerciales y pesados",
    "Core Pages": "P\u00e1ginas principales",
    "Procurement Services": "Servicios de abastecimiento",
    "China-Wide Sourcing": "Abastecimiento en toda China",
    "Financial Support": "Apoyo financiero",
    "Consultation Hotline": "L\u00ednea de consulta",
    "Join Us": "\u00danase a nosotros",
    "About Honglajiao Auto Export": "Acerca de Honglajiao Auto Export",
    "Full-service China car export \u2014 sourcing, inspection, documentation, customs, and shipping.": "Servicio completo de exportaci\u00f3n de autos de China \u2014 abastecimiento, inspecci\u00f3n, documentaci\u00f3n, aduana y env\u00edo.",
    "Hi, I am interested in sourcing vehicles from China.": "Hola, estoy interesado en abastecer veh\u00edculos de China.",
    "Construction Machinery & Heavy Equipment": "Maquinaria de construcci\u00f3n y equipo pesado",
    "Excavators, loaders, bulldozers, cranes and more \u2014 sourced from China": "Excavadoras, cargadoras, bulldozers, gr\u00faas y m\u00e1s \u2014 abastecidos de China",
    "No machinery currently available. Submit an inquiry with your requirements.": "No hay maquinaria disponible actualmente. Env\u00ede una consulta con sus requisitos.",
    "Wheel Loader": "Cargadora de ruedas",
    "Road Roller": "Compactadora",
    "Dump Truck": "Cami\u00f3n volquete",
    "Concrete Mixer": "Hormigonera",
    "Tractor": "Tractor",
    "Other Equipment": "Otro equipo",
    "Browse Machinery": "Explorar maquinaria",
    "Why Source from China": "Por qu\u00e9 abastecerse de China",
    "China is the world's largest automotive market with competitive pricing, vast inventory, and mature export infrastructure.": "China es el mayor mercado automotriz del mundo con precios competitivos, amplio inventario e infraestructura de exportaci\u00f3n madura.",
    "Import Process": "Proceso de importaci\u00f3n",
    "Customs Duties & Taxes": "Aranceles e impuestos aduaneros",
    "Get a Quote for": "Obtenga cotizaci\u00f3n para",
    "Contact us for a personalized quote": "Cont\u00e1ctenos para una cotizaci\u00f3n personalizada",
    "Duty Rate (CIF": "Tasa arancelaria (CIF",
    "Related Guides": "Gu\u00edas relacionadas",
    "Submit Requirements": "Enviar requisitos",
    "Tell us your vehicle type, budget and destination": "Ind\u00edquenos su tipo de veh\u00edculo, presupuesto y destino",
    "We find verified suppliers matching your needs": "Encontramos proveedores verificados que coinciden con sus necesidades",
    "Inspection & Shipping": "Inspecci\u00f3n y env\u00edo",
    "On-site inspection, documentation, customs, and delivery": "Inspecci\u00f3n en sitio, documentaci\u00f3n, aduana y entrega",
    "No results found": "Sin resultados",
    "Privacy Policy": "Pol\u00edtica de privacidad",
    "Terms of Service": "T\u00e9rminos de servicio",
    "verified vehicles ready for export \u2014 bare car price shown, export costs not included": "veh\u00edculos verificados listos para exportaci\u00f3n \u2014 precio neto mostrado, costos de exportaci\u00f3n no incluidos",
    "Base Price": "Precio base",
    "Ex-Works China": "Ex f\u00e1brica China",
    "+ export costs": "+ costos de exportaci\u00f3n",
    "No vehicles currently available. Check back soon.": "No hay veh\u00edculos disponibles actualmente. Vuelva pronto.",
    "Don't see what you need?": "\u00bfNo ve lo que necesita?",
    "Submit Custom Inquiry": "Enviar consulta personalizada",
    "Vehicle Condition": "Estado del veh\u00edculo",
    "Inquire About This Vehicle": "Consultar sobre este veh\u00edculo",
    "Drive Side": "Lado de conducci\u00f3n",
    "Exterior": "Exterior",
    "Interior": "Interior",
    "VIN (last 6": "VIN (\u00faltimos 6",
    "Admin Access": "Acceso de administrador",
    "Enter password to view inquiries": "Ingrese contrase\u00f1a para ver consultas",
    "Unlock": "Desbloquear",
    "Wrong password": "Contrase\u00f1a incorrecta",
    "\u2190 Back to site": "\u2190 Volver al sitio",
    "\U0001f4cb Inquiry Dashboard": "\U0001f4cb Panel de consultas",
    "submissions": "env\u00edos",
    "\U0001f504 Refresh": "\U0001f504 Actualizar",
    "Loading...": "Cargando...",
    "No inquiries yet.": "A\u00fan no hay consultas.",
    "Select an inquiry to view": "Seleccione una consulta para ver",
    "Chat": "Chat",
    "Form": "Formulario",
    "Chat Widget": "Widget de chat",
    "Inquiry Form": "Formulario de consulta",
    "Language": "Idioma",
    "Date": "Fecha",
    "Time": "Hora",
    "Quick Actions": "Acciones r\u00e1pidas",
    "WhatsApp": "WhatsApp",
    "Copy": "Copiar",
}

# Parse and replace
pattern = r'(\\w+):\\s*E\\(([^)]*(?:\\([^)]*\\)[^)]*)*)\\)'
updated = 0

def replace_match(m):
    global updated
    key = m.group(1)
    args_str = m.group(2)
    args = []
    current = ''
    in_quote, quote_char = False, None
    for c in args_str:
        if c in "'\\\"":
            if not in_quote:
                in_quote = True
                quote_char = c
            elif c == quote_char:
                in_quote = False
                quote_char = None
            current += c
        elif c == ',' and not in_quote:
            args.append(current.strip().strip("'\\\""))
            current = ''
        else:
            current += c
    args.append(current.strip().strip("'\\\""))
    
    en = args[0] if args else ''
    fr = args[1] if len(args) > 1 else ''
    es = args[2] if len(args) > 2 else ''
    zh = args[3] if len(args) > 3 else ''
    
    changed = False
    for d in [FR, ES]:
        if en in d:
            if d is FR: fr = d[en]
            else: es = d[en]
            changed = True
    
    if changed: updated += 1
    
    new_args = [en, fr, es, zh]
    quoted = []
    for a in new_args:
        esc = a.replace("\\\\", "\\\\\\\\").replace("'", "\\\\'")
        quoted.append(f"'{esc}'")
    return f"{key}: E({', '.join(quoted)})"

result = re.sub(pattern, replace_match, text)

with open('src/i18n/translations.ts', 'w') as f:
    f.write(result)

print(f"Updated: {updated} entries")

# Verify
with open('src/i18n/translations.ts') as f:
    v = f.read()
empty_fr = len(re.findall(r"E\\('[^']*',\\s*''", v))
empty_es = len(re.findall(r"E\\('[^']*',\\s*'[^']*',\\s*''", v))
print(f"Remaining: FR={empty_fr}, ES={empty_es}")
