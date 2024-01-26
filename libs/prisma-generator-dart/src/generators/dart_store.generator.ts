import { DMMF, GeneratorOptions } from "@prisma/generator-helper";
import { PrismaHelper, StringFns } from "@shared";
import { DartGeneratorSettings } from "../dart_settings.interface";
import { dartStoreClassIncludeStub, dartStoreEndpoint, dartStoreEndpointAll, dartStoreEndpointAllName, dartStoreEndpointMany, dartStoreEndpointManyName, dartStoreEndpointName, dartStoreGetAll$, dartStoreGetByPropertyVal, dartStoreGetByPropertyVal$, dartStoreGetManyByPropertyVal, dartStoreGetManyByPropertyVal$, dartStoreGetRelatedModels, dartStoreGetRelatedModels$, dartStoreGetRelatedModelsWithId, dartStoreGetRelatedModelsWithId$, dartStoreGetVal, dartStoreIncludesConstructor, dartStoreIncludesEmptyConstructor, dartStoreStub, dartStoreUpdateRefStoreForField, dartStoreUpdateRefStoreForListField, dartStoreUpdateRefStores, dartStoreUpdateRefStoresForList } from "../stubs/store.stub";
import { get } from "http";
import { DartGenerator } from "./dart.generator";


export class DartStoreGenerator {

    private prismaHelper: PrismaHelper;
    private dartGenerator: DartGenerator;

    constructor(private settings: DartGeneratorSettings, private model: DMMF.Model, private options: GeneratorOptions) {
        this.prismaHelper = PrismaHelper.getInstance();
        this.dartGenerator = new DartGenerator(settings, model);
    }

    generateContent() {

        let content = dartStoreStub;

        content = content.replace(/#{AutoGeneratedWarningText}/g, this.settings.AutoGeneratedWarningText);
        content = content.replace(/#{Model}/g, this.model.name);

        const getValMethods: string[] = [];
        const getUniqueByPropertyVal: string[] = [];
        // const getPropToValueFunction: string[] = [];
        const getByPropertyVal: string[] = [];
        const GetRelatedModels: string[] = [];
        const GetRelatedModelsWithId: string[] = [];
        const getUniqueByPropertyVal$: string[] = [];
        const getByPropertyVal$: string[] = [];
        const endpoints: string[] = [];
        const GetRelatedModels$: string[] = [];
        const GetRelatedModelsWithId$: string[] = [];
        const modelFields: DMMF.Field[] = [];
        const includesConstructor: string[] = [];

        endpoints.push(this.generateEndpointAll());

        for (const field of this.model.fields) {
            if (field.kind === 'object') {
                modelFields.push(field);
                includesConstructor.push(this.generateIncludesConstructor(field));
                const relationFromFields = field.relationFromFields;
                
                if (relationFromFields != null && relationFromFields?.length > 0) {
                    const relatedFieldName = relationFromFields[0];
                    GetRelatedModelsWithId$.push(this.generateGetRelatedModelsWithId$(field, relatedFieldName));
                    GetRelatedModelsWithId.push(this.generateGetRelatedModelsWithId(field, relatedFieldName));
                } else {
                    const relatedModelStore = `${field.type}Store`;
                    GetRelatedModels$.push(this.generateGetRelatedModels$(field, relatedModelStore));
                    GetRelatedModels.push(this.generateGetRelatedModels(field, relatedModelStore));
                }
            } else {
                getValMethods.push(this.generateGetValMethod(field));
                // getPropToValueFunction.push(this.generatePropertyToValFunction(field));
                if (field.isUnique || field.isId) {
                    getUniqueByPropertyVal$.push(this.generateGetByPropertyVal$(field));
                    if (!field.isId) {
                        getUniqueByPropertyVal.push(this.generateGetByPropertyVal(field));
                    }
                    endpoints.push(this.generateEndpoint(field));
                } else {
                    getByPropertyVal$.push(this.generateGetManyByPropertyVal$(field));
                    getByPropertyVal.push(this.generateGetManyByPropertyVal(field));
                    endpoints.push(this.generateEndpointMany(field));
                }
            }
        }

        content = content.replace(/#{GetAll\$}/g, this.generateGetAll$());
        content = content.replace(/#{GetValMethods}/g, getValMethods.join('\n\n\t'));
        content = content.replace(/#{GetByPropertyVal}/g, getUniqueByPropertyVal.join('\n\n\t'));
        // content = content.replace(/#{GetPropertyValueFunctions}/g, getPropToValueFunction.join('\n\n\t'));
        content = content.replace(/#{GetManyByPropertyVal}/g, getByPropertyVal.join('\n\n\t'));
        content = content.replace(/#{GetRelatedModelsWithId}/g, GetRelatedModelsWithId.join('\n\n\t'));
        content = content.replace(/#{GetRelatedModels}/g, GetRelatedModels.join('\n\n\t'));
        content = content.replace(/#{GetByPropertyVal\$}/g, getUniqueByPropertyVal$.join('\n\n\t'));
        content = content.replace(/#{GetManyByPropertyVal\$}/g, getByPropertyVal$.join('\n\n\t'));
        content = content.replace(/#{GetRelatedModelsWithId\$}/g, GetRelatedModelsWithId$.join('\n\n\t'));
        content = content.replace(/#{GetRelatedModels\$}/g, GetRelatedModels$.join('\n\n\t'));
        content = content.replace(/#{UpdateRefStores}/g, this.generateUpdateRefStores(modelFields));
        content = content.replace(/#{UpdateRefStoresForList}/g, this.generateUpdateRefStoresForList());
        content = content.replace(/#{Endpoints}/g, endpoints.join(',\n\t'));
        if (includesConstructor.length === 0) {
            includesConstructor.push(this.replaceAllVariables(dartStoreIncludesEmptyConstructor));
        }
        let classIncludeContent = this.replaceAllVariables(dartStoreClassIncludeStub);
        classIncludeContent = classIncludeContent.replace(/#{IncludeConstructors}/g, includesConstructor.join('\n\n\t'));
        content = content.replace(/#{ClassInclude}/g, classIncludeContent);
        /* } else {
            content = content.replace(/#{ClassInclude}/g, '');
        } */
        return content;
    }
    generateIncludesConstructor(field: DMMF.Field): string {
        let content = dartStoreIncludesConstructor;
        return this.replaceAllVariables(content, field);
    }

    generateGetValMethod(field: DMMF.Field) {
        let content = dartStoreGetVal;
        return this.replaceAllVariables(content, field);
    }

    /* generatePropertyToValFunction(field: DMMF.Field) {
        let content = getPropertyValueFunctionStub;
        return this.replaceAllVariables(content, field);
    } */

    generateGetAll$() {
        let content = dartStoreGetAll$;
        content = content.replace(/#{EndPointAllName}/g, dartStoreEndpointAllName);
        return this.replaceAllVariables(content);
    }

    generateGetByPropertyVal(field: DMMF.Field) {
        let content = dartStoreGetByPropertyVal;
        return this.replaceAllVariables(content, field);
    }

    generateGetManyByPropertyVal(field: DMMF.Field) {
        let content = dartStoreGetManyByPropertyVal;
        return this.replaceAllVariables(content, field);
    }

    generateGetRelatedModelsWithId(field: DMMF.Field, relationFromField: string) {
        let content = dartStoreGetRelatedModelsWithId;
        content = content.replace(/#{relationFromField}/g, relationFromField);
        // content = content.replace(/#{GetIncludingType}/g, `${field.type}`);
        content = content.replace(/#{StreamReturnType}/g, `${field.type}?`);
        return this.replaceAllVariables(content, field);
    }

    generateGetRelatedModels(field: DMMF.Field, relatedModelStore: string) {
        const relationToFieldName = PrismaHelper.getInstance().getRelationToFieldName(field, this.options) ?? '';
        const relationToFieldNameCapitalized = StringFns.capitalize(relationToFieldName);
        let content = dartStoreGetRelatedModels;
        content = content.replace(/#{RelatedModelStore}/g, relatedModelStore);
        // content = content.replace(/#{GetIncludingType}/g, `${field.type}`);
        content = content.replace(/#{relationToFieldName}/g, relationToFieldName);
        content = content.replace(/#{RelationToFieldName}/g, relationToFieldNameCapitalized);
        if (field.isList) {
            content = content.replace(/#{StreamReturnType}/g, `List<${field.type}>`);
            content = content.replace(/#{setRefModelFunction}/g, 'setIncludedReferencesForList');
        } else {
            content = content.replace(/#{StreamReturnType}/g, `${field.type}?`);
            content = content.replace(/#{setRefModelFunction}/g, 'setIncludedReferences');
        }
        return this.replaceAllVariables(content, field);
    }

    generateUpdateRefStores(fields: DMMF.Field[]) {
        let content = dartStoreUpdateRefStores;
        content = this.replaceAllVariables(content);
        let updateRefStores = '';
        for (const field of fields) {
            updateRefStores += this.generateUpdateRefStoreForField(field);
        }
        content = content.replace(/#{UpdateRefStoreForFields}/g, updateRefStores);
        content = content.replace(/#{UpdateStoresRecursiveDepth_SETTING}/g, this.settings.UpdateStoresDefaultRecursiveDepth.toString());
        return content;
    }

    generateUpdateRefStoreForField(field: DMMF.Field) {
        let content = field.isList ? dartStoreUpdateRefStoreForListField : dartStoreUpdateRefStoreForField;
        content = content.replace(/#{FieldType}/g, field.type);
        return this.replaceAllVariables(content, field);
    }

    generateUpdateRefStoresForList() {
        let content = dartStoreUpdateRefStoresForList;
        content = content.replace(/#{UpdateStoresRecursiveDepth_SETTING}/g, this.settings.UpdateStoresDefaultRecursiveDepth.toString());
        return this.replaceAllVariables(content);
    }

    generateGetByPropertyVal$(field: DMMF.Field) {
        let content = dartStoreGetByPropertyVal$;
        content = content.replace(/#{EndPointName}/g, this.generateEndpointName(true));
        return this.replaceAllVariables(content, field);
    }

    generateGetManyByPropertyVal$(field: DMMF.Field) {
        let content = dartStoreGetManyByPropertyVal$;
        content = content.replace(/#{EndPointManyName}/g, this.generateEndpointName(false));
        return this.replaceAllVariables(content, field);
    }


    generateGetRelatedModelsWithId$(field: DMMF.Field, relationFromField: string) {
        let content = dartStoreGetRelatedModelsWithId$;
        content = content.replace(/#{relationFromField}/g, relationFromField);
        content = content.replace(/#{StreamReturnType}/g, `${field.type}?`);
        // content = content.replace(/#{GetIncludingType}/g, `${field.type}`);
        
        /* if (field.isList) {
            content = content.replace(/#{getIncluding\$}/g, 'getManyIncluding$');
        } else {
            content = content.replace(/#{getIncluding\$}/g, 'getIncluding$');
        } */
        return this.replaceAllVariables(content, field);
    }

    generateGetRelatedModels$(field: DMMF.Field, relatedModelStore: string) {
        let relationToFieldName = StringFns.capitalize(PrismaHelper.getInstance().getRelationToFieldName(field, this.options) ?? '');
        let content = dartStoreGetRelatedModels$;
        content = content.replace(/#{RelatedModelStore}/g, relatedModelStore);
        // content = content.replace(/#{GetIncludingType}/g, `${field.type}`);
        content = content.replace(/#{RelationToFieldName}/g, relationToFieldName);
        if (field.isList) {
            content = content.replace(/#{StreamReturnType}/g, `List<${field.type}>`);
            // content = content.replace(/#{getIncluding\$}/g, 'getManyIncluding$');
        } else {
            content = content.replace(/#{StreamReturnType}/g, `${field.type}?`);
            // content = content.replace(/#{getIncluding\$}/g, 'getIncluding$');
        }

        return this.replaceAllVariables(content, field);
    }


    generateEndpoint(field: DMMF.Field) {
        let content = dartStoreEndpoint;
        content = content.replace(/#{EndPointName}/g, this.generateEndpointName(true));
        return this.replaceAllVariables(content, field);
    }

    generateEndpointMany(field: DMMF.Field) {
        let content = dartStoreEndpointMany;
        content = content.replace(/#{EndPointManyName}/g, this.generateEndpointName(false));
        return this.replaceAllVariables(content, field);
    }

    generateEndpointAll() {
        let content = dartStoreEndpointAll;
        content = content.replace(/#{EndPointAllName}/g, dartStoreEndpointAllName);
        return this.replaceAllVariables(content);
    }

    replaceAllVariables(content: string, field?: DMMF.Field) {
        return this.dartGenerator.replaceAllVariables(content, field);
        /* if (field) {
            content = content.replace(/#{FieldType}/g, this.dartGenerator.getDartType(field));
            content = content.replace(/#{IncludeType}/g, `List<${field.type}Include>?`);
            content = content.replace(/#{fieldName}/g, field.name);
            content = content.replace(/#{FieldName}/g, StringFns.capitalize(field.name));
        }
        content = content.replace(/#{Nullable}/g, '?');
        // content = content.replace(/#{model}/g, StringFns.decapitalize(this.model.name));
        content = content.replace(/#{moDel}/g, StringFns.decapitalize(this.model.name));
        content = content.replace(/#{Model}/g, this.model.name);
        return content; */
    }

    generateEndpointName(returnsSingleRecord: boolean) {
        return returnsSingleRecord ? dartStoreEndpointName : dartStoreEndpointManyName;
    }
}