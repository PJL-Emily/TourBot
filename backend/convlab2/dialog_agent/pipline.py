from convlab2.nlu.jointBERT.crosswoz import BERTNLU
from convlab2.dst.rule.crosswoz.dst import RuleDST
from convlab2.policy.mle.crosswoz.mle import MLE
from convlab2.nlg.sclstm.crosswoz.sc_lstm import SCLSTM
from copy import deepcopy

class Pipline():
    def __init__(self):
        # BERT nlu
        self.nlu = BERTNLU()
        # simple rule DST
        self.dst = RuleDST()
        # rule policy
        self.policy = MLE()
        # template NLG
        self.nlg = SCLSTM(is_user=False, use_cuda=False)


    def reply(utterance, current_state):
    '''
    input: 
    - utterance: (str)
    - current_state: (object)
    output: 
    - reply_utterance: (str)
    - next_state: (object)
    - recommend: [{domain-name}(str), ]
    - select: {domain-name}(str)
    - taxi: {'出发地': (str), '目的地':(str)'}
    - hotel: (str)
    - site: (str)
    - restaurant:(str)
    '''
        # get context
        context = None
        
        # get reply utterance
        input_action = self.nlu.predict(utterance, context)
        dst = self.dst.init_session(current_state)
        dst.update(input_action)
        dst.state['user_action'] = input_action
        output_action = self.policy.predict(dst.state)
        reply_utterance = self.nlg.generate(output_action)

        # get data
        self.dst.state['history'].append(utterance)
        next_state = deepcopy(dst.state)
        recommend = []
        select = []
        taxi = next_state['belief_state']['酒店']['出租']
        hotel = next_state['belief_state']['酒店']['名称']
        site = next_state['belief_state']['景点']['名称']
        restaurant = next_state['belief_state']['餐馆']['名称']
        for da in input_action:
            if da[0] == "Recommend":
                recommend.append(f'{da[1]}-{da[3]}')
            elif da[0] == "Select":
                select.append(f'{da[1]}-{da[3]}')

        return reply_utterance, dst.state, recommend, select, taxi, hotel, site, restaurant


    
    

    


