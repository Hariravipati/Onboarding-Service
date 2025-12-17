export class Featureregistory {
    feature_id: number;
    feature_name: string;
    handler: string;
}

export class KafaEventRegistory {
    domain_topic: string;
    features: Featureregistory[];
}